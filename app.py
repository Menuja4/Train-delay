from flask import Flask, render_template, request
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor

app = Flask(__name__)

# === Load datasets ===
class_data = pd.read_csv("train_delay_classification.csv")
reg_data = pd.read_csv("train_delay_regression.csv")

# === Encode categorical columns ===
class_encoders = {}
for col in ['train_name', 'route', 'weather', 'status']:
    le = LabelEncoder()
    class_data[col] = le.fit_transform(class_data[col])
    class_encoders[col] = le

reg_encoders = {}
for col in ['train_name', 'route', 'weather']:
    le = LabelEncoder()
    reg_data[col] = le.fit_transform(reg_data[col])
    reg_encoders[col] = le

# === Train models ===
X_class = class_data[['train_name', 'route', 'distance_km', 'departure_hour', 'temperature', 'weather']]
y_class = class_data['status']
clf_model = KNeighborsClassifier(n_neighbors=3)
clf_model.fit(X_class, y_class)

X_reg = reg_data[['train_name', 'route', 'distance_km', 'departure_hour', 'temperature', 'weather']]
y_reg = reg_data['delay_minutes']
reg_model = KNeighborsRegressor(n_neighbors=3)
reg_model.fit(X_reg, y_reg)

# === Routes ===
@app.route("/", methods=["GET", "POST"])
def index():
    status = None
    delay = None

    if request.method == "POST":
        # Get input from form
        train_name = request.form['train_name']
        route = request.form['route']
        distance_km = int(request.form['distance_km'])
        departure_hour = int(request.form['departure_hour'])
        temperature = int(request.form['temperature'])
        weather = request.form['weather']

        # Prepare input DataFrame
        new_train = pd.DataFrame([{
            "train_name": train_name,
            "route": route,
            "distance_km": distance_km,
            "departure_hour": departure_hour,
            "temperature": temperature,
            "weather": weather
        }])

        # Encode for classification
        for col in ['train_name', 'route', 'weather']:
            new_train[col] = class_encoders[col].transform(new_train[col])

        # Predict status
        pred_class = clf_model.predict(new_train)[0]
        status = class_encoders['status'].inverse_transform([pred_class])[0]

        # Encode for regression
        for col in ['train_name', 'route', 'weather']:
            new_train[col] = reg_encoders[col].transform(new_train[col])

        # Predict delay minutes
        delay = reg_model.predict(new_train)[0]

    return render_template("index.html", status=status, delay=round(delay, 1))

if __name__ == "__main__":
    app.run(debug=True)
