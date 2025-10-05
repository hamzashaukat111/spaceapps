# -------------------------------
# Ensemble Training Script: CatBoost + TabNet
# -------------------------------

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, f1_score, classification_report
from catboost import CatBoostClassifier
from pytorch_tabnet.tab_model import TabNetClassifier
import torch
import joblib
import os

# -------------------------------
# Configuration
# -------------------------------
DATA_PATH = "merged_exoplanet_debug_full_log.csv"
OUTPUT_DIR = "Models"
os.makedirs(OUTPUT_DIR, exist_ok=True)
RANDOM_STATE = 42

# -------------------------------
# Load Dataset
# -------------------------------
df = pd.read_csv(DATA_PATH)
print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Label distribution:\n", df['label'].value_counts())

# -------------------------------
# Preprocessing
# -------------------------------
# Fill missing numeric values
numeric_cols = ['period','duration','depth','radius','eqt','insol','st_teff','st_logg','st_rad','ra','dec']
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

# Encode categorical features
categorical_cols = ['source_id','mission_code']
for col in categorical_cols:
    df[col] = df[col].astype(str)
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    joblib.dump(le, os.path.join(OUTPUT_DIR, f"{col}_encoder.pkl"))

# Encode labels
label_encoder = LabelEncoder()
df['label_enc'] = label_encoder.fit_transform(df['label'])
joblib.dump(label_encoder, os.path.join(OUTPUT_DIR, "label_encoder.pkl"))

# Split features and target
X = df[numeric_cols + categorical_cols]
y = df['label_enc']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)
print("Train/Test shapes:", X_train.shape, X_test.shape)

# -------------------------------
# CatBoost Training
# -------------------------------
cat_features = [X.columns.get_loc(col) for col in categorical_cols]

cat_model = CatBoostClassifier(
    iterations=1000,
    learning_rate=0.05,
    depth=6,
    loss_function='MultiClass',
    eval_metric='MultiClass',
    random_seed=RANDOM_STATE,
    verbose=100
)
cat_model.fit(X_train, y_train, cat_features=cat_features, eval_set=(X_test, y_test), early_stopping_rounds=50)
cat_model.save_model(os.path.join(OUTPUT_DIR, "catboost_model.cbm"))

cat_pred_proba = cat_model.predict_proba(X_test)

# -------------------------------
# TabNet Training
# -------------------------------
# Scale numeric features for TabNet
scaler = StandardScaler()
X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()
X_train_scaled[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])
X_test_scaled[numeric_cols] = scaler.transform(X_test[numeric_cols])
joblib.dump(scaler, os.path.join(OUTPUT_DIR, "tabnet_scaler.pkl"))

tabnet_model = TabNetClassifier(
    n_d=16, n_a=16, n_steps=5, gamma=1.5,
    n_independent=2, n_shared=2, seed=RANDOM_STATE, verbose=0
)
tabnet_model.fit(
    X_train_scaled.values, y_train.values,
    eval_set=[(X_test_scaled.values, y_test.values)],
    max_epochs=200,
    patience=30,
    batch_size=256,
    virtual_batch_size=128
)
joblib.dump(tabnet_model, os.path.join(OUTPUT_DIR, "tabnet_model.pkl"))

tabnet_pred_proba = tabnet_model.predict_proba(X_test_scaled.values)

# -------------------------------
# Ensemble Predictions (Averaging)
# -------------------------------
ensemble_proba = (np.array(cat_pred_proba) + np.array(tabnet_pred_proba)) / 2
ensemble_pred = np.argmax(ensemble_proba, axis=1)

# -------------------------------
# Evaluation
# -------------------------------
acc = accuracy_score(y_test, ensemble_pred)
macro_f1 = f1_score(y_test, ensemble_pred, average='macro')
report = classification_report(y_test, ensemble_pred, target_names=label_encoder.classes_)

print("Ensemble Accuracy:", acc)
print("Ensemble Macro F1:", macro_f1)
print("Classification Report:\n", report)

# Save ensemble predictions
pd.DataFrame({
    'true_label': y_test,
    'pred_label': ensemble_pred
}).to_csv(os.path.join(OUTPUT_DIR, "ensemble_predictions.csv"), index=False)

print(f"All models and outputs saved in {OUTPUT_DIR}")
