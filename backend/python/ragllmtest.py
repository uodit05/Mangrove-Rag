import os

# Update with your API URL if using a hosted instance of Langsmith.
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "ls__4089bb2363884aa4b193bcc0fc613b4b"  # Update with your API key
# Update with your API URL if using a hosted instance of Langsmith.
os.environ["LANGCHAIN_HUB_API_URL"] = "https://api.hub.langchain.com"
os.environ["LANGCHAIN_HUB_API_KEY"] = "ls__4089bb2363884aa4b193bcc0fc613b4b"  # Update with your Hub API key
os.environ["HF_TOKEN"] = "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"  # Update with your Hub API key

from langchain import hub

# Loads the latest version
prompt = hub.pull("rlm/rag-prompt", api_url="https://api.hub.langchain.com")

# loading from drive
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
db3 = Chroma(persist_directory="/content/drive/MyDrive/chroma_embeddings", embedding_function= HuggingFaceEmbeddings())

# LLM
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline

hf_model = pipeline(
    "text-generation", model="gpt2", max_new_tokens=200, pad_token_id=50256
)
llm = HuggingFacePipeline(pipeline=hf_model)

# RetrievalQA
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm, retriever=db3.as_retriever(), chain_type_kwargs={"prompt": prompt}
)

question = "back covers"
result = qa_chain.invoke({"query": question})
print(result["result"])