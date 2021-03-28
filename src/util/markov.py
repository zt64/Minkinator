import markovify
import sys
# import json

# data = json.loads(sys.stdin.read())
text_model = markovify.NewlineText(sys.stdin.read(), state_size=3)

# print(json.dumps(text_model.make_sentence(tries=100)))
print(text_model.make_sentence(tries=100))
