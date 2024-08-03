import time
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] ="0"
import torch
import warnings
warnings.filterwarnings("ignore")
transfer_device = torch.device("cuda")
device = 0 if torch.cuda.is_available() else -1
start=time.process_time()

# Update with your API URL if using a hosted instance of Langsmith.
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "ls__4089bb2363884aa4b193bcc0fc613b4b"  # Update with your API key
# Update with your API URL if using a hosted instance of Langsmith.
os.environ["LANGCHAIN_HUB_API_URL"] = "https://api.hub.langchain.com"
os.environ["LANGCHAIN_HUB_API_KEY"] = "ls__4089bb2363884aa4b193bcc0fc613b4b"  # Update with your Hub API key
os.environ["HF_TOKEN"] = "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"  # Update with your Hub API key

# Loads the latest version
from langchain import hub
prompt = hub.pull("rlm/rag-prompt", api_url="https://api.hub.langchain.com")
# print(prompt)

# loading from drive
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
db3 = Chroma(
    persist_directory="C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/chroma_databases12", embedding_function= HuggingFaceEmbeddings()
)

#LLM
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline
hf_model = pipeline("text-generation", model="gpt2",max_new_tokens=256, pad_token_id=50256)
llm = HuggingFacePipeline(pipeline=hf_model)

# RetrievalQA
from langchain.chains import RetrievalQA
qa_chain = RetrievalQA.from_chain_type(
    llm=llm, retriever=db3.as_retriever(), chain_type_kwargs={"prompt": prompt}
)

question = "Suggest title of back covers using the given data.\
Follow this approach 1:Find titles with the term 'back covers' and 2:suggest in order of increasing price.\
give the output in json format."
result = qa_chain.invoke({"query": question})
# print(result["result"])

import re

npid_pattern = r'pid:\s*(\w+)'

# Retrieve all NPIDs using findall method
npids = re.findall(npid_pattern, result["result"])
dictionaryforjson={"npid":npids}
print(dictionaryforjson)

print("Time taken: ", time.process_time()-start, "seconds")