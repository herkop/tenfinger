import sys
import text

inputText = sys.argv[1]
text = Text(inputText)
sentences = text.sentence_texts
print(sentences)
sys.stdout.flush()