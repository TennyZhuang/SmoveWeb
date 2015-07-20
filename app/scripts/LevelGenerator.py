__author__ = 'kehao'
import json
import random
from copy import deepcopy

waves = []
wave = {'speed': 0, 'directions': []}
arr = []
for i in range(6 * 6):
    arr += [i]
    # dir  = [0,1,2,...,15]

_counts = [8, 10, 14, 20, 30, 50]
_speed = [200, 210, 230, 260, 280, 300]
_directions = [1, 2, 3, 4, 5, 6]
for i in range(len(_counts)):
    for j in range(_counts[i]):
        wave.clear()
        wave['speed'] = _speed[i]
        random.shuffle(arr)
        wave['directions'] = arr[0:_directions[i]]
        print([wave][:])
        waves.append(deepcopy(wave))
print('')
print(waves)
with open('level.json', 'w') as f:
    json.dump(waves, f)
