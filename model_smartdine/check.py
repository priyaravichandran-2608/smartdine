import pickle

df = pickle.load(open("indexes/meta_chennai.pkl", "rb"))
print(df.isna().sum())
print(df.head())
