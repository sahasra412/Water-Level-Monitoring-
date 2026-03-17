import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# Sample dataset
data = {
    "input": [10, 20, 30, 40, 50, 60],
    "output": [18, 26, 34, 42, 50, 58]
}

df = pd.DataFrame(data)

X = df[["input"]]
y = df["output"]

model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "model.pkl")

print("Model trained and saved")