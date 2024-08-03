#pip install git+https://github.com/openai/whisper.git 
#pip install git+https://github.com/LIAAD/yake

import warnings
warnings.filterwarnings("ignore")

#CODE 1: Loading whisper model for voice to text conversion

import whisper
#{variants:tiny,base,small,medium,large}
model = whisper.load_model("base")

#CODE 2: Loading audio file and converting it to text

import sys
filename=sys.argv[1]
# print(filename)
result = model.transcribe(filename)
# result = model.transcribe("C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/audio_files/backcover_audio_wav.wav")
# print(result["text"])

#CODE 3: Extracting keywords from the text

import yake

kw_extractor = yake.KeywordExtractor(top=10, stopwords=None)
keywords = kw_extractor.extract_keywords(result["text"])
# for kw, v in keywords:
#   print("Keyphrase: ",kw, ": score", v)

#CODE 4: Import dependencies for KNN

import os

os.environ["TF_ENABLE_ONEDNN_OPTS"]="0"

import tensorflow as tf
import tensorflow_hub as hub
# import matplotlib.pyplot as plt
import re
import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import PCA

from langchain_community.embeddings import HuggingFaceEmbeddings

# model_url="https://tfhub.dev/google/universal-sentence-encoder/4"
# model=hub.load(model_url)

#CODE 5: Load the model for KNN

model_id = "sentence-transformers/all-MiniLM-L6-v2"
hf_token = "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"
import requests

api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
headers = {"Authorization": f"Bearer {hf_token}"}
def embed(texts):
    response = requests.post(api_url, headers=headers, json={"inputs": texts, "options":{"wait_for_model":True}})
    return response.json()

# print("Model Loaded")

#CODE 6: Preprocess the dataset for KNN

df=pd.read_csv("C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/datasets/pid_single_cell_format.csv",engine="python")
# df.head()
df=df[["pid","col"]]

df=df.dropna()
df=df.reset_index()
df=df[:5500]

titles=list(df['col'])

embeddings=embed(titles)

#CODE 7: Implement KNN

# nn=NearestNeighbors(n_neighbors=5)
# nn.fit(embeddings)
import pickle

loaded_model = pickle.load(open('C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/datasets/knnpickle_file_3.unknown', 'rb'))

def recommend(text):
  emb=embed([text])
  neighbors=loaded_model.kneighbors(emb,return_distance=False)[0]
  return df['pid'].iloc[neighbors].tolist()

# print(recommend("give some car cover"))

#CODE 8: pass extracted keywords to function
product_set=set()
for (kw, v) in keywords:
  product_set.update(recommend(kw))
#   print(recommend(kw))

# print(product_set)

#CODE 9: converting output to json

import json

# Convert the dictionary to JSON format
json_output = json.dumps(list(product_set))

# Print the JSON output
print(json_output)

sys.stdout.flush()