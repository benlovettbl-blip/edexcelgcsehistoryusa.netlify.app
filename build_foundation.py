import json
import re

with open('topics.json', 'r', encoding='utf-8') as f:
    topics_str = f.read()

# eval-like parsing since keys might not have quotes
import ast
# We need to add quotes to keys to make it valid JSON
topics_json_str = re.sub(r'(\w+):', r'"\1":', topics_str)
# also replace single quotes with double quotes for text
# actually wait, it's safer to just use node to parse it and output strict JSON!
