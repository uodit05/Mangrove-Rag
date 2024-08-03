import os

os.environ["TF_ENABLE_ONEDNN_OPTS"]="0"

import tensorflow as tf
import tensorflow_hub as hub
# import matplotlib.pyplot as plt

import os
import re
import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import PCA

from langchain_community.embeddings import HuggingFaceEmbeddings

# model_url="https://tfhub.dev/google/universal-sentence-encoder/4"
# model=hub.load(model_url)

model_id = "sentence-transformers/all-MiniLM-L6-v2"
hf_token = "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"
import requests

api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
headers = {"Authorization": f"Bearer {hf_token}"}
def embed(texts):
    response = requests.post(api_url, headers=headers, json={"inputs": texts, "options":{"wait_for_model":True}})
    return response.json()

print("Model Loaded")

df=pd.read_csv("C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/datasets/pid_single_cell_format.csv",engine="python")
# df.head()
df=df[["pid","col"]]

df=df.dropna()
df=df.reset_index()
# df=df[:5500]

titles=list(df['col'])

embeddings=embed(titles)

nn=NearestNeighbors(n_neighbors=10)
nn.fit(embeddings)

def recommend(text):
  emb=embed([text])
  neighbors=nn.kneighbors(emb,return_distance=False)[0]
  return df['pid'].iloc[neighbors].tolist()

print(recommend("give some car cover"))