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

# def train_test_split_idx(n:int,test_size:float=0.2,seed:int=42):
#     rng = np.random.default_rng(seed)
#     idx = np.arrange(n)
#     rng.shuffle(idx)
#     test_n = int(round(n*test_size))
#     return idx[test_n:],idx[:test_n]

class NaiveBayesImplementation:
    def __init__(self,alpha:float=1.0,class_weights: dict = None):
        self.alpha = alpha
        self.classes_ = []
        self.vocab_ = {}
        self.class_priors = {}
        self.likelihoods_ = {}
        self.class_weights = class_weights

        

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
        if self.class_weights:
            
            weighted_counts = {c: counts[c] * self.class_weights.get(c, 1.0) 
                             for c in counts}
            total_weighted = sum(weighted_counts.values())
            self.class_priors_ = {c: math.log(weighted_counts[c]/total_weighted) 
                                for c in classes}
        else:
            self.class_priors_ = {c:math.log(counts[c]/total_docs) for c in classes }
        #so this function basically creates a dictionary that stores classes:no of occurences
        #also another dictionary that stores unique words with unique identifiers from the caption

        V = len(vocab)
        word_counts = {c: np.zeros(V,dtype=int) for c in classes}
        total_tokens = {c: 0 for c in classes}

        for tokens, cls in zip(X_tokens,y):
            for t in tokens:
                j = vocab.get(t)
                if j is not None:
                    word_counts[cls][j] +=1
                    total_tokens[cls] +=1
        self.likelihoods_ = {}
        for c in classes:
            denom = total_tokens[c] + self.alpha * V
            self.likelihoods_[c] = {j:math.log((cnt + self.alpha)/denom) for j,cnt in enumerate(word_counts[c])}

    def predict_one(self,tokens:List[str])->str:
        idxs = [self.vocab_[t] for t in tokens if t in self.vocab_]
        best_c, best_score = None, -1e18

        for c in self.classes_:
            score = self.class_priors_[c]
            like_c = self.likelihoods_[c]
            for j in idxs:
                score+=like_c[j]
            if score>best_score:
                best_c, best_score = c, score
        return best_c

    def predict(self,X_tokens:List[List[str]]):
        return [self.predict_one(t) for t in X_tokens]

    def to_json(self) -> str:
        model = {
            "alpha" :self.alpha,
            "classes" : self.classes_,
            "vocab" : self.vocab_,
            "class_priors_log" : self.class_priors_,
            "likelihoods_log" : {c: [self.likelihoods_[c][j] for j in range(len(self.vocab_))] for c in self.classes_},
        }   
        return json.dumps(model)


