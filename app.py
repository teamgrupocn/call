from flask import Flask, request, Response

app = Flask(__name__)

@app.route("/twiml", methods=['POST'])
def twiml():
    response = """
    <Response>
        <Say voice="alice" language="pt-BR">Olá, esta é uma mensagem personalizada.</Say>
    </Response>
    """
    return Response(response, mimetype='text/xml')

if __name__ == "__main__":
    app.run(debug=True)
