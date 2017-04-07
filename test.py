import sys
from estnltk import Text

inputText = sys.argv[1]
text = Text(inputText)
sentences = text.sentence_texts
print(sentences)
sys.stdout.flush()