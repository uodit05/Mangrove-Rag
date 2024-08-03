#CODE 1: SETTING ENVIRONMENT KEYS
import os
import warnings
warnings.filterwarnings("ignore")

# Update with your API URL if using a hosted instance of Langsmith.
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "ls__4089bb2363884aa4b193bcc0fc613b4b"  # Update with your API key
# Update with your API URL if using a hosted instance of Langsmith.
os.environ["LANGCHAIN_HUB_API_URL"] = "https://api.hub .langchain.com"
os.environ["LANGCHAIN_HUB_API_KEY"] = "ls__4089bb2363884aa4b193bcc0fc613b4b"  # Update with your Hub API key
os.environ["HF_TOKEN"] = "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"  # Update with your Hub API key
os.environ["TF_ENABLE_ONEDNN_OPTS"]="0"

#CODE 2: 
from langchain import hub

# Loads the latest version
prompt = hub.pull("rlm/rag-prompt", api_url="https://api.hub.langchain.com")

#CODE 3: CREATING CHROMA DATABASE

#FLIPKART DATASET 
# Load docs
# # from langchain.document_loaders import WebBaseLoader

# from langchain.document_loaders.csv_loader import CSVLoader

# # # loader = WebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/")
# loader=CSVLoader(file_path="C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/datasets/output.csv", encoding="utf-8")
# data = loader.load()
# # print(data[:5])

# # Split
# from langchain.text_splitter import RecursiveCharacterTextSplitter

# text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
# all_splits = text_splitter.split_documents(data)

# Store splits
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# # vectorstore = Chroma.from_documents(documents=all_splits, embedding= HuggingFaceEmbeddings())

# # saving to drive
# vectorstoretodisc = Chroma.from_documents(documents=all_splits, embedding= HuggingFaceEmbeddings(),persist_directory="C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/chroma_databases")

# loading from drive
db3 = Chroma(persist_directory="C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/chroma_single_cell_format", embedding_function= HuggingFaceEmbeddings())

# CODE 5: CREATING LLM PIPELINE

from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline
import torch

device = 0 if torch.cuda.is_available() else -1 # 0 for GPU, -1 for CPU

hf_model = pipeline(
    "text-generation", model="gpt2", max_new_tokens=200, pad_token_id=50256
)
llm = HuggingFacePipeline(pipeline=hf_model)

#CODE 6: CREATING RAG LLM PIPELINE

# RetrievalQA
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm, retriever=db3.as_retriever(), chain_type_kwargs={"prompt": prompt}
)

#CODE 7: TESTING THE RAG LLM PIPELINE

import sys
question=" ".join(sys.argv)
# question = "Answer the following questions using the given data.\
# What is the product id of the product title Bastex Back Cover for Moto G9  (Multicolor) in the given data?"
result = qa_chain.invoke({"query": question})
# print(result["result"])

#CODE 8: RETREIVING NPIDS FROM THE OUTPUT

import re

npid_pattern = r'PID:\s*(\w+)'

npids = re.findall(npid_pattern, result["result"])
dictionaryforjson={"npid":npids}
#CODE 9: CONVERTING OUTPUT TO JSON

import json

json_output = json.dumps(npids)

print(json_output)

sys.stdout.flush()