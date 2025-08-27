import pandas as pd
import numpy as np
import re
import math
import json
from collections import Counter
from pathlib import Path
from typing import List, Tuple

STOPWORDS = {
    "a","an","the","and","or","if","in","on","of","for","to","from","is","are","was","were",
    "be","been","being","it","its","this","that","these","those","as","at","by","with","but",
    "about","into","over","after","before","while","so","no","not","too","very","can","cannot",
    "we","you","your","yours","our","ours","they","them","their","theirs","he","she","his","her",
    "i","me","my","mine","do","does","did","doing","have","has","had","having","will","would",
    "should","could","may","might","also","than","then","there","here","up","down","out",
    "just","like"
}

TOKEN_RE = re.compile(r"[a-z]+")

def normalize_text(text:str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+"," ",text)
    text = re.sub(r"[@#]\w+", " ",text)
    return text

def tokenize(text:str) -> List[str]:
    text = normalize_text(text)
    tokens = TOKEN_RE.findall(text)
    return [t for t in tokens if t not in STOPWORDS and len(t)>1]

def train_test_split_idx(n:int,test_size:float=0.2,seed:int=42):
    rng = np.random.default_rng(seed)
    idx = np.arrange(n)
    rng.shuffle(idx)
    test_n = int(round(n*test_size))
    return idx[test_n:],idx[:test_n]

class NaiveBayesImplementation:
    def __init__(self,alpha:float=1.0):
        self.alpha = alpha
        self.classes_ = []
        self.vocab_ = {}
        self.class_priors = {}
        self.likelihoods_ = {}

    def fit(self,X_tokens:List[List[str]],y:List[str]) -> None:
        vocab = {}
        for tokens in X_tokens:
            for t in tokens:
                if t not in vocab:
                    vocab[t] = len(vocab)
        self.vocab_ = vocab

        classes = sorted(set(y))
        self.classes_ = classes
        total_docs = len(y)
        counts = Counter(y)
        self.class_priors_ = {c:math.log(counts[c]/total_docs) for c in classes }
        