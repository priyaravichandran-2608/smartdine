import pandas as pd

# CHANGE THIS to your CSV file path
file_path = "chennai_restaurants.csv"

df = pd.read_csv(file_path)

print("\n=== COLUMN NAMES ===")
for col in df.columns:
    print(col)
