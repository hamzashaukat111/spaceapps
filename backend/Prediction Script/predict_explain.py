# ------------------------------------------------------------
# predict_explain.py
# ------------------------------------------------------------
# This version provides clear, human-readable prompts with
# short descriptions of each feature during input.
# ------------------------------------------------------------

import numpy as np
import joblib
import pandas as pd
from catboost import CatBoostClassifier, Pool
from pytorch_tabnet.tab_model import TabNetClassifier

# ------------------------------------------------------------
# Configuration
# ------------------------------------------------------------
OUTPUT_DIR = "spaceapps/backend/Models"

# Ordered feature lists
numeric_cols = [
    'period', 'duration', 'depth', 'radius', 'eqt', 'insol',
    'st_teff', 'st_logg', 'st_rad', 'ra', 'dec'
]
categorical_cols = ['source_id', 'mission_code']

# Feature descriptions for user input
feature_info = {
    'period': ("Orbital period of the exoplanet (in days)",
               "Time for the planet to complete one orbit around its star."),
    'duration': ("Transit duration (in hours)",
                 "Time taken by the planet to pass in front of the star."),
    'depth': ("Transit depth (ppm or relative flux)",
              "Brightness decrease during transit, linked to planet size."),
    'radius': ("Planet radius (in Earth radii, R⊕)",
               "The physical size of the exoplanet."),
    'eqt': ("Equilibrium temperature (Kelvin)",
            "Estimated temperature assuming blackbody radiation."),
    'insol': ("Insolation flux (relative to Earth, S⊕)",
              "Stellar energy received compared to Earth."),
    'st_teff': ("Stellar effective temperature (Kelvin)",
                "Surface temperature of the host star."),
    'st_logg': ("Stellar surface gravity (log10 cm/s²)",
                "Describes the star’s gravity and structure."),
    'st_rad': ("Stellar radius (in Solar radii, R☉)",
               "Size of the star compared to the Sun."),
    'ra': ("Right Ascension (degrees)",
           "Celestial coordinate for the star’s sky position."),
    'dec': ("Declination (degrees)",
            "Celestial coordinate for the star’s sky position."),
    'source_id': ("Source ID (e.g., 'Kepler-22', 'TIC12345')",
                  "Identifier of the object in its survey dataset."),
    'mission_code': ("Mission code ('KEPLER', 'TESS', or 'K2')",
                     "Survey mission that observed the target.")
}

# ------------------------------------------------------------
# Load models, encoders, and scaler
# ------------------------------------------------------------
print("🚀 Loading trained models and encoders...")

cat_model = CatBoostClassifier()
cat_model.load_model(f"{OUTPUT_DIR}/catboost_model.cbm")

tabnet_model = joblib.load(f"{OUTPUT_DIR}/tabnet_model.pkl")
scaler = joblib.load(f"{OUTPUT_DIR}/tabnet_scaler.pkl")

label_encoder = joblib.load(f"{OUTPUT_DIR}/label_encoder.pkl")
source_encoder = joblib.load(f"{OUTPUT_DIR}/source_id_encoder.pkl")
mission_encoder = joblib.load(f"{OUTPUT_DIR}/mission_code_encoder.pkl")

# ------------------------------------------------------------
# Input Section
# ------------------------------------------------------------
print("\n🪐 Please enter details about the exoplanet candidate below:")
print("------------------------------------------------------------")

user_data = {}

# Collect numeric inputs
for col in numeric_cols:
    title, desc = feature_info[col]
    print(f"\n📘 {title}\n   ↳ {desc}")
    while True:
        try:
            val = float(input(f"   → Enter {col}: "))
            user_data[col] = val
            break
        except ValueError:
            print("❌ Please enter a valid number.")

# Collect categorical inputs
for col in categorical_cols:
    title, desc = feature_info[col]
    print(f"\n🔹 {title}\n   ↳ {desc}")
    val = input(f"   → Enter {col}: ").strip()
    user_data[col] = val

# ------------------------------------------------------------
# Data Preparation
# ------------------------------------------------------------
df = pd.DataFrame([user_data])

# Encode categorical features
df['source_id'] = source_encoder.transform(df['source_id'].astype(str))
df['mission_code'] = mission_encoder.transform(df['mission_code'].astype(str))

# Scale numeric features for TabNet
X_input = df[numeric_cols + categorical_cols]
X_input_scaled = X_input.copy()
X_input_scaled[numeric_cols] = scaler.transform(X_input[numeric_cols])

# ------------------------------------------------------------
# Prediction
# ------------------------------------------------------------
print("\n🔭 Generating predictions...")

# CatBoost
cat_pred_proba = cat_model.predict_proba(
    Pool(X_input, cat_features=[X_input.columns.get_loc(c) for c in categorical_cols])
)

# TabNet
tabnet_pred_proba = tabnet_model.predict_proba(X_input_scaled.values)

# Ensemble prediction (average probabilities)
ensemble_proba = (cat_pred_proba + tabnet_pred_proba) / 2
ensemble_pred_idx = np.argmax(ensemble_proba, axis=1)
ensemble_conf = np.max(ensemble_proba, axis=1)
ensemble_pred_labels = label_encoder.inverse_transform(ensemble_pred_idx)

# ------------------------------------------------------------
# Explainability
# ------------------------------------------------------------
cat_shap_values = cat_model.get_feature_importance(
    Pool(X_input, cat_features=[X_input.columns.get_loc(c) for c in categorical_cols]),
    type='ShapValues'
)
tabnet_feat_importances = tabnet_model.feature_importances_

# ------------------------------------------------------------
# Display Results
# ------------------------------------------------------------
print("\n============================== 🌌 Prediction Result ==============================")
print(f" Predicted Classification : {ensemble_pred_labels[0]}")
print(f" Confidence Score          : {ensemble_conf[0]:.4f}")
print("==============================================================================")

# Label meanings
print("\n📗 Label meanings:")
print("  • 'planet' → Confirmed exoplanet")
print("  • 'candidate' → Possible exoplanet candidate")
print("  • 'false_positive' → Not a real planet (noise/artifact)")

print("\n🔬 Feature Contributions (CatBoost SHAP):")
pred_class_idx = ensemble_pred_idx[0]
shap_row = cat_shap_values[0, :-1, pred_class_idx]
for f, shap_val, actual in zip(X_input.columns, shap_row, X_input.iloc[0]):
    title = feature_info[f][0]
    print(f"  {title:45s} → Value={actual:.4f}, SHAP={shap_val:+.4f}")

print("\n📊 TabNet Global Feature Importances:")
for f, imp_val, actual in zip(X_input.columns, tabnet_feat_importances, X_input.iloc[0]):
    title = feature_info[f][0]
    print(f"  {title:45s} → Value={actual:.4f}, Importance={imp_val:.4f}")

print("\n✅ Prediction complete.")
