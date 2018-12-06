from database import DatabasePort
from flask import Flask, render_template, jsonify, request
from itertools import chain
from psycopg2.extras import DictCursor
import json


app = Flask(__name__)


@app.route('/')
def render_index():
    data = []
    dp = DatabasePort()
    with dp.connection_handler(commit=True, cursor_factory=DictCursor) as cursor:
        with open('./static/queries.json') as queries:
            data = json.load(queries)
            query = data['get_huouston_parts']
            cursor.execute(query)
            rows = list(chain(*cursor.fetchall()))
            data = rows

    return render_template('index.html', data=map(json.dumps, data))

@app.route('/statisticsperstate')
def render_burgers():
    dp = DatabasePort()
    with dp.connection_handler(commit=True, cursor_factory=DictCursor) as cursor:
        with open('./static/queries.json') as queries:
            data = json.load(queries)
            query = data['state_statistics']
            cursor.execute(query)
            rows = list(chain(*cursor.fetchall()))
    return jsonify(rows)


@app.route('/obesitycoloring')
def render_fat():
    dp = DatabasePort()
    with dp.connection_handler(commit=True, cursor_factory=DictCursor) as cursor:
        with open('./static/queries.json') as queries:
            data = json.load(queries)
            query = data['obesity_per_state']
            cursor.execute(query)
            rows = list(chain(*cursor.fetchall()))

            obesity_arrs = [[], [], [], []]                
            for state in rows:
                if state['obesity'] >= 20 and state['obesity'] < 24:
                    state['properties']['fill'] = "#32CD32"
                    obesity_arrs[0].append(state['obesity'])
                elif state['obesity'] >= 24 and state['obesity'] < 28:
                    state['properties']['fill'] = "#FFD700"
                    obesity_arrs[1].append(state['obesity'])
                elif state['obesity'] >= 28 and state['obesity'] < 32:
                    state['properties']['fill'] = "#FF8C00"
                    obesity_arrs[2].append(state['obesity'])
                else:
                    state['properties']['fill'] = "#DC143C"
                    obesity_arrs[3].append(state['obesity'])
            
            for lst in obesity_arrs:
                lst.sort()
            a = 0.5  # lower opacity
            b = 0.8  # higher opacity
            diff = 0
            for state in rows:
                if state['obesity'] > 20 and state['obesity'] < 24:
                    diff = (obesity_arrs[0][-1] - obesity_arrs[0][0]) / 2
                    if state['obesity'] < obesity_arrs[0][0] + diff:
                        state['properties']['fill-opacity'] = a
                    else:
                        state['properties']['fill-opacity'] = b
                elif state['obesity'] >= 24 and state['obesity'] < 28:
                    diff = (obesity_arrs[1][-1] - obesity_arrs[1][0]) / 2
                    if state['obesity'] < obesity_arrs[1][0] + diff:
                        state['properties']['fill-opacity'] = a
                    else:
                        state['properties']['fill-opacity'] = b
                elif state['obesity'] >= 28 and state['obesity'] < 32:
                    diff = (obesity_arrs[2][-1] - obesity_arrs[2][0]) / 2
                    if state['obesity'] < obesity_arrs[2][0] + diff:
                        state['properties']['fill-opacity'] = a
                    else:
                        state['properties']['fill-opacity'] = b
                else:
                    diff = (obesity_arrs[3][-1] - obesity_arrs[3][0]) / 2
                    if state['obesity'] < obesity_arrs[3][0] + diff:
                        state['properties']['fill-opacity'] = a
                    else:
                        state['properties']['fill-opacity'] = b
                    
    return jsonify(rows)

@app.route('/houstonparts')
def McDonaldHeatmap():
    houstonPart = request.args.get('state')
    print(houstonPart, type(houstonPart))
    dp = DatabasePort()
    with dp.connection_handler(commit=True, cursor_factory=DictCursor) as cursor:
        with open('./static/queries.json') as queries:
            data = json.load(queries)
            query = data['find_specific_houston_part']
            cursor.execute(query, (houstonPart,))
            rows = list(chain(*cursor.fetchall()))
            query = data['mcdonalds_in_houstuon_part']
            cursor.execute(query, (houstonPart,))
            lst = list(chain(*cursor.fetchall()))
            rows += lst
    return jsonify(rows)