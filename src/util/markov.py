import markovify
import sys
import json

option = sys.argv[1]


def generate():
    while True:
        model_json = sys.stdin.readline()
        if model_json:
            break
    model_json = json.loads(model_json)
    reconstituted_model = markovify.NewlineText.from_json(model_json)
    print(reconstituted_model.make_sentence(tries=100))


def mkcorpus():
    while True:
        corpus = sys.stdin.readline()
        if corpus:
            break
    corpus = json.loads(corpus)
    text_model = markovify.NewlineText(corpus, state_size=3)
    model_json = text_model.to_json()
    print(json.dumps(model_json))


commands = {
  "generate": generate,
  "mkcorpus": mkcorpus
}

commands[option]()
