from flask import Flask, render_template, request
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsRegressor

app = Flask(__name__)


data = pd.read_csv("train_delay_regression_edited.csv")

encoders = {}
for col in ['train_name', 'route', 'weather','day_of_week','holiday']:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    encoders[col] = le

X = data[['train_name', 'route', 'day_of_week', 'holiday', 'temperature', 'weather']]
y = data['delay_minutes']

model = KNeighborsRegressor(n_neighbors=3)
model.fit(X, y)





@app.route("/")
def home():
    return render_template("front_page.html")

@app.route("/train_delay_4", methods=["GET", "POST"])
def train_delay_4():
    delay = None

    if request.method == "POST":
        train_name = request.form['train_name']
        route = request.form['route']
        day_of_week = request.form['day_of_week']
        holiday = request.form['holiday']
        temperature = int(request.form['temperature'])
        weather = request.form['weather']


        new_train = pd.DataFrame([{
            "train_name": train_name,
            "route": route,
            "day_of_week": day_of_week,
            "holiday": holiday,
            "temperature": temperature,
            "weather": weather
        }])

        # Encode categorical columns
        for col in ['train_name', 'route', 'weather','day_of_week','holiday']:
            new_train[col] = encoders[col].transform(new_train[col])

        # Predict delay
        delay = model.predict(new_train)[0]

    return render_template("train_delay_4.html", delay=round(delay, 1) if delay is not None else None)


if __name__ == "__main__":
    app.run(debug=True)
