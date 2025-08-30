import pandas as pd
import numpy as np
import re
import math
import json
from collections import Counter
from pathlib import Path
from typing import List, Tuple, Dict, Any

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

class NaiveBayesImplementation:
    def __init__(self, alpha:float=1.0, class_weights: dict = None):
        self.alpha = alpha
        self.classes_ = []
        self.vocab_ = {}
        self.vocab_list_ = []  
        self.class_priors_ = {}
        self.likelihoods_ = {}
        self.class_weights = class_weights

    def fit(self, X_tokens:List[List[str]], y:List[str]) -> None:
        
        vocab = {}
        vocab_list = []
        for tokens in X_tokens:
            for t in tokens:
                if t not in vocab:
                    vocab[t] = len(vocab_list)
                    vocab_list.append(t)
        self.vocab_ = vocab
        self.vocab_list_ = vocab_list

        
        classes = sorted(set(y))
        self.classes_ = classes
        total_docs = len(y)
        counts = Counter(y)
        
        
        if self.class_weights:
            weighted_counts = {c: counts[c] * self.class_weights.get(c, 1.0) for c in counts}
            total_weighted = sum(weighted_counts.values())
            self.class_priors_ = {c: math.log(weighted_counts[c]/total_weighted) for c in classes}
        else:
            self.class_priors_ = {c: math.log(counts[c]/total_docs) for c in classes}

        
        V = len(vocab)
        word_counts = {c: np.zeros(V, dtype=int) for c in classes}
        total_tokens = {c: 0 for c in classes}

        
        for tokens, cls in zip(X_tokens, y):
            for t in tokens:
                if t in vocab:
                    j = vocab[t]
                    word_counts[cls][j] += 1
                    total_tokens[cls] += 1

        
        self.likelihoods_ = {}
        for c in classes:
            denom = total_tokens[c] + self.alpha * V
            self.likelihoods_[c] = [math.log((word_counts[c][j] + self.alpha) / denom) for j in range(V)]

    def predict_one(self, tokens:List[str]) -> str:
        scores = {}
        for c in self.classes_:
            scores[c] = self.class_priors_[c]
            for token in tokens:
                if token in self.vocab_:
                    word_idx = self.vocab_[token]
                    scores[c] += self.likelihoods_[c][word_idx]
                else:
                   
                    scores[c] += math.log(1e-10)
        
        return max(scores.items(), key=lambda x: x[1])[0]

    def predict(self, X_tokens:List[List[str]]) -> List[str]:
        return [self.predict_one(tokens) for tokens in X_tokens]

    def to_json(self) -> str:
        model_data = {
            "alpha": self.alpha,
            "classes": self.classes_,
            "vocab": self.vocab_,
            "vocab_list": self.vocab_list_,  
            "class_priors_log": self.class_priors_,
            "likelihoods_log": self.likelihoods_,
        }
        return json.dumps(model_data, indent=2)

    @classmethod
    def from_json(cls, json_str: str):
        model_data = json.loads(json_str)
        instance = cls(alpha=model_data["alpha"])
        instance.classes_ = model_data["classes"]
        instance.vocab_ = model_data["vocab"]
        instance.vocab_list_ = model_data["vocab_list"]
        instance.class_priors_ = model_data["class_priors_log"]
        instance.likelihoods_ = model_data["likelihoods_log"]
        return instance

# Helper function for loading and using the model
def load_naive_bayes_model(model_path: str):
    with open(model_path, 'r', encoding='utf-8') as f:
        model_json = f.read()
    return NaiveBayesImplementation.from_json(model_json)