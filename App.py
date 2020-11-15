from flask import Flask, render_template
from flask import request
from flask import jsonify
import psycopg2


app = Flask(__name__)

conn = psycopg2.connect(host="cc3201.dcc.uchile.cl",
    database="cc3201",
    user="lab7",
    password="j<3_cc3201", port="5440")
conn.autocommit = True


print("starting")

@app.route('/')
def index():
    return render_template('index.html', secure=False)



@app.route('/search')
def search():
	input = request.args.get('query')

	cur = conn.cursor()
	
	cur.execute("SELECT nombres, apellido_p, apellido_m, mes, anho, total FROM uchile.transparencia WHERE apellido_p='"+input+"' ORDER BY total DESC LIMIT 250")

	try:
		rows = [row for row in cur.fetchall()]
	except: 
		rows = []

	cur.close()

	return jsonify(rows)



if __name__ == '__main__':
    app.debug = True
    app.run(port=5000)



