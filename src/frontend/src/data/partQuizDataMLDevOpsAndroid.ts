// Part Quiz Data — ML, DevOps, and Android domains
import type { PartQuizData } from "./partQuizData";

// Helper builders
function mcq(
  id: string,
  question: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string,
) {
  return { id, question, options, correct, explanation, xp: 5 as const };
}

function pq(
  id: string,
  title: string,
  description: string,
  examples: { input: string; output: string }[],
  starterCode: string,
  languageId: number,
  languageLabel: string,
  hints: [string, string, string],
  solutionKeywords: string[],
) {
  return {
    id,
    title,
    description,
    examples,
    starterCode,
    languageId,
    languageLabel,
    hints,
    solutionKeywords,
    xp: 20 as const,
  };
}

// ─── ML: ML Fundamentals ──────────────────────────────────────────────────────
const ML_M1_P1: PartQuizData = {
  mcqs: [
    mcq(
      "mlm1p1-1",
      "Machine learning is a subset of:",
      [
        "Statistics",
        "Artificial Intelligence",
        "Database Management",
        "Computer Networks",
      ],
      1,
      "ML is a branch of AI that enables systems to learn from data without being explicitly programmed.",
    ),
    mcq(
      "mlm1p1-2",
      "Supervised learning uses:",
      [
        "Unlabeled data",
        "Labeled training data",
        "Random data",
        "Only test data",
      ],
      1,
      "Supervised learning trains on labeled data — each input has a known output (label).",
    ),
    mcq(
      "mlm1p1-3",
      "Unsupervised learning finds:",
      [
        "Pre-defined labels",
        "Hidden patterns in unlabeled data",
        "Rewards for actions",
        "Exact classifications",
      ],
      1,
      "Unsupervised learning discovers structure (clusters, patterns) in data without labels.",
    ),
    mcq(
      "mlm1p1-4",
      "Which is a supervised learning task?",
      [
        "Clustering",
        "Dimensionality reduction",
        "Classification",
        "Anomaly detection without labels",
      ],
      2,
      "Classification (e.g., spam detection) is supervised — it predicts a category from labeled examples.",
    ),
    mcq(
      "mlm1p1-5",
      "Reinforcement learning learns by:",
      [
        "Labeled examples",
        "Clustering",
        "Trial-and-error with rewards/penalties",
        "Dimensionality reduction",
      ],
      2,
      "Reinforcement learning uses an agent that gets rewards or penalties based on its actions.",
    ),
    mcq(
      "mlm1p1-6",
      "What is a training dataset?",
      [
        "Data used to evaluate the model",
        "Data used to fit/learn model parameters",
        "Data kept secret until deployment",
        "A random sample",
      ],
      1,
      "Training data is used to teach the model — it adjusts parameters based on training examples.",
    ),
    mcq(
      "mlm1p1-7",
      "What is a test dataset used for?",
      [
        "Training the model",
        "Tuning hyperparameters",
        "Evaluating final model performance on unseen data",
        "Cleaning data",
      ],
      2,
      "The test set is held out during training and used only once to evaluate final model performance.",
    ),
    mcq(
      "mlm1p1-8",
      "A feature in ML refers to:",
      [
        "The output prediction",
        "An independent input variable used for prediction",
        "The model algorithm",
        "The loss function",
      ],
      1,
      "Features (also called attributes or input variables) are the measurable properties used to train the model.",
    ),
    mcq(
      "mlm1p1-9",
      "A label in supervised learning is:",
      [
        "An input feature",
        "The target output the model should predict",
        "A hyperparameter",
        "A layer in a neural network",
      ],
      1,
      "The label is the correct answer (target variable) the model tries to predict during training.",
    ),
    mcq(
      "mlm1p1-10",
      "Which algorithm is used for classification?",
      ["Linear regression", "K-Means", "Logistic regression", "PCA"],
      2,
      "Logistic regression is a supervised algorithm used for binary classification tasks.",
    ),
    mcq(
      "mlm1p1-11",
      "Linear regression predicts:",
      [
        "Categories",
        "Clusters",
        "Continuous numeric values",
        "Probabilities only",
      ],
      2,
      "Linear regression predicts a continuous numeric output (e.g., house price) from input features.",
    ),
    mcq(
      "mlm1p1-12",
      "Overfitting means a model:",
      [
        "Performs poorly on training data",
        "Learns training data too well and fails on new data",
        "Has no parameters",
        "Uses too few features",
      ],
      1,
      "An overfitted model memorizes training noise, so it performs poorly on unseen (test) data.",
    ),
    mcq(
      "mlm1p1-13",
      "Underfitting means:",
      [
        "Model is too complex",
        "Model is too simple and can't capture the pattern",
        "Model trains too slowly",
        "Model has too many features",
      ],
      1,
      "Underfitting occurs when the model is too simple — it can't capture the underlying data pattern.",
    ),
    mcq(
      "mlm1p1-14",
      "K-Means is an example of:",
      [
        "Supervised learning",
        "Reinforcement learning",
        "Unsupervised clustering",
        "Semi-supervised learning",
      ],
      2,
      "K-Means is an unsupervised clustering algorithm that groups data into k clusters.",
    ),
    mcq(
      "mlm1p1-15",
      "Which metric measures regression model error?",
      ["Accuracy", "F1 Score", "Mean Squared Error (MSE)", "Precision"],
      2,
      "MSE measures the average squared difference between predicted and actual values — lower is better.",
    ),
  ],
  programmingQuestions: [
    pq(
      "mlm1p1-pq1",
      "Describe a Classification Model",
      "Write a Python function `describe_model(model_type)` that returns a string description of a model. If model_type is 'supervised', return 'Learns from labeled data'. If 'unsupervised', return 'Finds patterns in unlabeled data'. Otherwise return 'Unknown type'.",
      [
        { input: "supervised", output: "Learns from labeled data" },
        { input: "unsupervised", output: "Finds patterns in unlabeled data" },
      ],
      `def describe_model(model_type):
    # Return description based on model_type
    pass

print(describe_model("supervised"))
print(describe_model("unsupervised"))`,
      71,
      "Python",
      [
        "Use an if-elif-else chain to check the model_type string.",
        "Compare model_type == 'supervised', elif model_type == 'unsupervised', else return Unknown.",
        `if model_type == 'supervised':\n    return 'Learns from labeled data'\nelif model_type == 'unsupervised':\n    return 'Finds patterns in unlabeled data'\nelse:\n    return 'Unknown type'`,
      ],
      ["def", "if", "elif", "else", "return", "supervised", "unsupervised"],
    ),
  ],
};

// ─── ML: Feature Engineering ─────────────────────────────────────────────────
const ML_M1_P2: PartQuizData = {
  mcqs: [
    mcq(
      "mlm1p2-1",
      "Feature engineering is the process of:",
      [
        "Training the model",
        "Using domain knowledge to create useful input features",
        "Evaluating model accuracy",
        "Splitting data",
      ],
      1,
      "Feature engineering transforms raw data into features that better represent the underlying problem to the ML model.",
    ),
    mcq(
      "mlm1p2-2",
      "Min-Max normalization scales data to:",
      ["0 to 100", "0 to 1", "-1 to 1", "Mean 0, std 1"],
      1,
      "Min-Max normalization rescales values to [0, 1] using (x - min) / (max - min).",
    ),
    mcq(
      "mlm1p2-3",
      "Standardization (Z-score) transforms data to have:",
      [
        "Range 0-1",
        "Only positive values",
        "Mean=0 and Std=1",
        "Integer values",
      ],
      2,
      "Z-score standardization subtracts the mean and divides by standard deviation: z = (x - μ) / σ.",
    ),
    mcq(
      "mlm1p2-4",
      "One-hot encoding converts:",
      [
        "Numerical to categorical",
        "Categorical variables to binary columns",
        "Strings to integers directly",
        "Images to arrays",
      ],
      1,
      "One-hot encoding creates binary columns for each category — useful for nominal categorical data.",
    ),
    mcq(
      "mlm1p2-5",
      "Label encoding assigns:",
      [
        "Random values",
        "Binary vectors",
        "Integer codes to categories",
        "Float values",
      ],
      2,
      "Label encoding maps each category to a unique integer (e.g., cat→0, dog→1, fish→2).",
    ),
    mcq(
      "mlm1p2-6",
      "Why is feature scaling important?",
      [
        "It removes outliers",
        "Algorithms like KNN and SVM are sensitive to feature magnitude",
        "It increases model complexity",
        "It converts labels",
      ],
      1,
      "Distance-based algorithms perform poorly when features have very different scales.",
    ),
    mcq(
      "mlm1p2-7",
      "Missing values can be handled by:",
      [
        "Ignoring them always",
        "Imputation (filling with mean/median/mode)",
        "Only deleting rows",
        "Multiplying by zero",
      ],
      1,
      "Imputation fills missing values with statistics like mean, median, or mode to preserve data.",
    ),
    mcq(
      "mlm1p2-8",
      "Feature selection reduces:",
      [
        "Model accuracy",
        "Number of input features to the most relevant ones",
        "Training examples",
        "Labels",
      ],
      1,
      "Feature selection picks the most informative features, reducing dimensionality and noise.",
    ),
    mcq(
      "mlm1p2-9",
      "An outlier is:",
      [
        "The most common value",
        "An extreme value far from others",
        "The median value",
        "A missing value",
      ],
      1,
      "Outliers are data points that differ significantly from other observations and may distort model training.",
    ),
    mcq(
      "mlm1p2-10",
      "PCA (Principal Component Analysis) is used for:",
      [
        "Classification",
        "Dimensionality reduction",
        "Data labeling",
        "Model evaluation",
      ],
      1,
      "PCA reduces dimensions by finding principal components (directions of maximum variance).",
    ),
    mcq(
      "mlm1p2-11",
      "The correlation coefficient ranges from:",
      ["0 to 1", "0 to 100", "-1 to 1", "-100 to 100"],
      2,
      "Correlation ranges from -1 (perfect negative) through 0 (no correlation) to +1 (perfect positive).",
    ),
    mcq(
      "mlm1p2-12",
      "Ordinal encoding is appropriate for:",
      [
        "Nominal categories (no order)",
        "Categories with a meaningful order",
        "Continuous variables",
        "Binary data only",
      ],
      1,
      "Ordinal encoding preserves order (e.g., low→1, medium→2, high→3) for ordered categories.",
    ),
    mcq(
      "mlm1p2-13",
      "Which Python library is commonly used for data preprocessing?",
      ["TensorFlow", "PyTorch", "scikit-learn", "Matplotlib"],
      2,
      "scikit-learn provides preprocessing tools like StandardScaler, MinMaxScaler, and OneHotEncoder.",
    ),
    mcq(
      "mlm1p2-14",
      "Feature extraction creates:",
      [
        "Raw features from scratch",
        "New features derived from existing ones",
        "Model outputs",
        "Training labels",
      ],
      1,
      "Feature extraction derives new, informative features from raw data (e.g., extracting date parts from a timestamp).",
    ),
    mcq(
      "mlm1p2-15",
      "Binning (discretization) converts:",
      [
        "Categories to numbers",
        "Continuous values into discrete bins/intervals",
        "Binary to one-hot",
        "Integers to floats",
      ],
      1,
      "Binning groups continuous values into discrete intervals (e.g., age 0-18, 19-35, 36+).",
    ),
  ],
  programmingQuestions: [
    pq(
      "mlm1p2-pq1",
      "Normalize an Array",
      "Write a Python function `normalize(arr)` that applies Min-Max normalization to a list of numbers, returning a list where all values are scaled to [0, 1]. Formula: (x - min) / (max - min).",
      [{ input: "[2, 4, 6, 8, 10]", output: "[0.0, 0.25, 0.5, 0.75, 1.0]" }],
      `def normalize(arr):
    # Apply Min-Max normalization
    pass

print(normalize([2, 4, 6, 8, 10]))`,
      71,
      "Python",
      [
        "Find the min and max of arr, then apply (x - min) / (max - min) for each element.",
        "Use a list comprehension: [(x - min_val) / (max_val - min_val) for x in arr].",
        "min_val = min(arr)\nmax_val = max(arr)\nreturn [(x - min_val) / (max_val - min_val) for x in arr]",
      ],
      ["def", "min", "max", "return", "for", "in", "normalize"],
    ),
    pq(
      "mlm1p2-pq2",
      "Encode Categories",
      "Write a Python function `label_encode(categories)` that takes a list of string labels and returns a dict mapping each unique label to an integer index (sorted alphabetically).",
      [
        {
          input: "['cat', 'dog', 'cat', 'bird']",
          output: "{'bird': 0, 'cat': 1, 'dog': 2}",
        },
      ],
      `def label_encode(categories):
    # Create label encoding dict
    pass

print(label_encode(['cat', 'dog', 'cat', 'bird']))`,
      71,
      "Python",
      [
        "Get sorted unique values using sorted(set(categories)).",
        "Use enumerate to assign integer indices, then build a dict.",
        "unique = sorted(set(categories))\nreturn {label: i for i, label in enumerate(unique)}",
      ],
      ["def", "sorted", "set", "enumerate", "return", "dict"],
    ),
  ],
};

// ─── ML: Model Training ───────────────────────────────────────────────────────
const ML_M1_P3: PartQuizData = {
  mcqs: [
    mcq(
      "mlm1p3-1",
      "The train-test split divides data for:",
      [
        "Data cleaning only",
        "Training the model and evaluating it separately",
        "Feature engineering",
        "Visualization",
      ],
      1,
      "Train-test split separates data so the model trains on one subset and is evaluated on unseen data.",
    ),
    mcq(
      "mlm1p3-2",
      "A typical train-test ratio is:",
      ["90:10", "80:20", "50:50", "70:5:25"],
      1,
      "80% training and 20% testing is a common default split ratio in ML.",
    ),
    mcq(
      "mlm1p3-3",
      "Cross-validation helps:",
      [
        "Speed up training",
        "Reduce overfitting by evaluating on multiple folds",
        "Increase dataset size",
        "Remove outliers",
      ],
      1,
      "Cross-validation trains and evaluates on different data partitions, giving a more reliable performance estimate.",
    ),
    mcq(
      "mlm1p3-4",
      "K-fold cross-validation splits data into:",
      [
        "K random samples",
        "K equal folds, training on K-1 and testing on 1 each time",
        "K different models",
        "K features",
      ],
      1,
      "K-fold splits data into K equal folds and runs K iterations, each using a different fold as the test set.",
    ),
    mcq(
      "mlm1p3-5",
      "The loss function measures:",
      [
        "Model complexity",
        "How wrong the model's predictions are",
        "Number of parameters",
        "Training speed",
      ],
      1,
      "The loss function quantifies prediction error — the optimizer minimizes it during training.",
    ),
    mcq(
      "mlm1p3-6",
      "Gradient descent is an optimization algorithm that:",
      [
        "Increases loss",
        "Randomly adjusts weights",
        "Iteratively adjusts parameters to minimize loss",
        "Splits data",
      ],
      2,
      "Gradient descent moves parameters in the direction that reduces the loss function step by step.",
    ),
    mcq(
      "mlm1p3-7",
      "Learning rate in gradient descent controls:",
      [
        "Number of epochs",
        "Step size for parameter updates",
        "Model architecture",
        "Data split ratio",
      ],
      1,
      "A high learning rate may overshoot minima; too low makes training slow. It controls update step size.",
    ),
    mcq(
      "mlm1p3-8",
      "An epoch in ML training means:",
      [
        "One data sample",
        "One complete pass through the entire training dataset",
        "One layer update",
        "One test run",
      ],
      1,
      "One epoch = one full pass through all training samples — models typically train for many epochs.",
    ),
    mcq(
      "mlm1p3-9",
      "Hyperparameters are:",
      [
        "Learned during training",
        "Set before training (e.g., learning rate, depth)",
        "Output predictions",
        "Data labels",
      ],
      1,
      "Hyperparameters are configuration settings chosen before training, unlike parameters learned from data.",
    ),
    mcq(
      "mlm1p3-10",
      "Regularization reduces overfitting by:",
      [
        "Removing training data",
        "Adding a penalty for model complexity",
        "Increasing epochs",
        "Reducing test size",
      ],
      1,
      "Regularization (L1/L2) adds a penalty term to the loss that discourages overly complex models.",
    ),
    mcq(
      "mlm1p3-11",
      "L1 regularization (Lasso) promotes:",
      [
        "Dense weights",
        "Sparse weights (many zeros)",
        "Larger learning rates",
        "More epochs",
      ],
      1,
      "L1 regularization tends to drive some weights to exactly zero, performing feature selection.",
    ),
    mcq(
      "mlm1p3-12",
      "L2 regularization (Ridge) adds:",
      [
        "Sum of absolute weights to loss",
        "Sum of squared weights to loss",
        "A dropout layer",
        "Batch normalization",
      ],
      1,
      "L2 adds the sum of squared parameter values to the loss, penalizing large weights.",
    ),
    mcq(
      "mlm1p3-13",
      "The validation set is used for:",
      [
        "Final evaluation",
        "Tuning hyperparameters during training",
        "Initial data cleaning",
        "Data augmentation",
      ],
      1,
      "The validation set monitors model performance during training to tune hyperparameters without touching test data.",
    ),
    mcq(
      "mlm1p3-14",
      "Batch size in training refers to:",
      [
        "Total training samples",
        "Number of samples per gradient update",
        "Number of epochs",
        "Model layers",
      ],
      1,
      "Mini-batch training updates parameters after processing batch_size samples, balancing speed and stability.",
    ),
    mcq(
      "mlm1p3-15",
      "Which sklearn function splits data into train and test sets?",
      [
        "split_data()",
        "train_test_split()",
        "data_split()",
        "cross_val_score()",
      ],
      1,
      "sklearn.model_selection.train_test_split() is the standard function for splitting datasets.",
    ),
  ],
  programmingQuestions: [
    pq(
      "mlm1p3-pq1",
      "Train a Sklearn Model",
      "Write Python code that creates a simple dataset (X = [[1],[2],[3],[4],[5]], y = [2,4,6,8,10]), splits it 80/20, trains a LinearRegression model, and prints the model's coefficient.",
      [{ input: "(none)", output: "Coefficient: 2.0" }],
      `from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

X = [[1],[2],[3],[4],[5]]
y = [2,4,6,8,10]

# Split, train, and print coefficient
`,
      71,
      "Python",
      [
        "Use train_test_split(X, y, test_size=0.2) to split the data.",
        "Create LinearRegression(), call .fit(X_train, y_train), then access .coef_.",
        `X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\nprint("Coefficient:", model.coef_[0])`,
      ],
      ["LinearRegression", "train_test_split", "fit", "coef_", "print"],
    ),
    pq(
      "mlm1p3-pq2",
      "Cross-Validation Score",
      "Write Python code that uses cross_val_score with 5-fold CV on a LinearRegression model with the dataset X=[[1],[2],[3],[4],[5]], y=[2,4,6,8,10] and prints the mean score.",
      [{ input: "(none)", output: "Mean CV Score: 1.0" }],
      `from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score
import numpy as np

X = [[1],[2],[3],[4],[5]]
y = [2,4,6,8,10]

# Perform 5-fold cross validation and print mean score
`,
      71,
      "Python",
      [
        "Call cross_val_score(model, X, y, cv=5) to get scores for each fold.",
        "Use np.mean(scores) to compute the average score across folds.",
        `model = LinearRegression()\nscores = cross_val_score(model, X, y, cv=5)\nprint("Mean CV Score:", np.mean(scores))`,
      ],
      ["LinearRegression", "cross_val_score", "np.mean", "cv=5", "print"],
    ),
  ],
};

// ─── ML: Neural Networks ──────────────────────────────────────────────────────
const ML_M1_P4: PartQuizData = {
  mcqs: [
    mcq(
      "mlm1p4-1",
      "A neural network is inspired by:",
      [
        "Decision trees",
        "The human brain's neurons",
        "SQL databases",
        "K-Means clustering",
      ],
      1,
      "Neural networks are modeled after biological neural networks — interconnected nodes process information.",
    ),
    mcq(
      "mlm1p4-2",
      "The input layer of a neural network:",
      [
        "Transforms data",
        "Applies activation functions",
        "Receives raw input features",
        "Produces final output",
      ],
      2,
      "The input layer receives raw feature data and passes it to the hidden layers.",
    ),
    mcq(
      "mlm1p4-3",
      "Hidden layers in a neural network:",
      [
        "Are visible to users",
        "Extract intermediate representations from data",
        "Only hold bias values",
        "Are optional in all models",
      ],
      1,
      "Hidden layers learn intermediate feature representations between input and output.",
    ),
    mcq(
      "mlm1p4-4",
      "An activation function introduces:",
      [
        "Data normalization",
        "Non-linearity into the network",
        "Regularization",
        "Input encoding",
      ],
      1,
      "Without activation functions, a neural network would only compute linear transformations.",
    ),
    mcq(
      "mlm1p4-5",
      "The ReLU activation function outputs:",
      ["x for all x", "max(0, x)", "1 / (1 + e^-x)", "tanh(x)"],
      1,
      "ReLU (Rectified Linear Unit) outputs max(0, x) — zero for negatives, x for positives.",
    ),
    mcq(
      "mlm1p4-6",
      "The sigmoid function outputs values in range:",
      ["(-∞, +∞)", "(0, 1)", "(-1, 1)", "(0, ∞)"],
      1,
      "Sigmoid compresses any real value to (0, 1), making it useful for binary classification output.",
    ),
    mcq(
      "mlm1p4-7",
      "The softmax function is used in:",
      [
        "Binary classification output",
        "Multi-class classification output",
        "Regression output",
        "Hidden layers only",
      ],
      1,
      "Softmax converts output logits to a probability distribution over multiple classes.",
    ),
    mcq(
      "mlm1p4-8",
      "Backpropagation is used to:",
      [
        "Forward pass data",
        "Calculate and propagate gradients to update weights",
        "Load training data",
        "Scale features",
      ],
      1,
      "Backpropagation computes gradients of the loss w.r.t. each weight using the chain rule.",
    ),
    mcq(
      "mlm1p4-9",
      "Deep learning refers to:",
      [
        "Simple 1-layer networks",
        "Neural networks with many hidden layers",
        "Only CNNs",
        "Classical ML algorithms",
      ],
      1,
      "Deep learning uses deep neural networks (many layers) to learn hierarchical representations.",
    ),
    mcq(
      "mlm1p4-10",
      "Dropout is a regularization technique that:",
      [
        "Removes input features",
        "Randomly disables neurons during training to prevent overfitting",
        "Increases model depth",
        "Normalizes inputs",
      ],
      1,
      "Dropout randomly sets a fraction of neurons to zero each forward pass, reducing co-dependence.",
    ),
    mcq(
      "mlm1p4-11",
      "Batch normalization:",
      [
        "Reduces dataset size",
        "Normalizes layer inputs to speed up training and stabilize learning",
        "Changes batch size",
        "Applies dropout",
      ],
      1,
      "Batch normalization normalizes activations within a mini-batch, enabling faster and more stable training.",
    ),
    mcq(
      "mlm1p4-12",
      "A Convolutional Neural Network (CNN) is best for:",
      [
        "Tabular data",
        "Image recognition tasks",
        "Time series only",
        "Text generation",
      ],
      1,
      "CNNs use convolutional layers to detect spatial patterns — ideal for image processing.",
    ),
    mcq(
      "mlm1p4-13",
      "An RNN (Recurrent Neural Network) is suited for:",
      [
        "Static tabular data",
        "Sequential/time-series data",
        "Image classification",
        "Clustering",
      ],
      1,
      "RNNs maintain a hidden state across time steps, making them ideal for sequential data like text or time series.",
    ),
    mcq(
      "mlm1p4-14",
      "In Keras, which method compiles a model?",
      ["model.build()", "model.compile()", "model.fit()", "model.train()"],
      1,
      "model.compile() configures the model with optimizer, loss function, and metrics before training.",
    ),
    mcq(
      "mlm1p4-15",
      "The number of parameters in a Dense layer depends on:",
      [
        "Only the activation function",
        "Input size and output size: (inputs × outputs) + outputs",
        "Batch size",
        "Learning rate",
      ],
      1,
      "A Dense layer has (input_units × output_units) weights + output_units biases = total parameters.",
    ),
  ],
  programmingQuestions: [
    pq(
      "mlm1p4-pq1",
      "Build a Simple Neural Network with Keras",
      "Write Python code using Keras to build a Sequential model with: an input layer of 4 features, one Dense hidden layer of 8 units with ReLU, and an output Dense layer with 1 unit and sigmoid activation. Print the model summary.",
      [{ input: "(none)", output: 'Model: "sequential" (summary printed)' }],
      `from tensorflow import keras
from tensorflow.keras import layers

# Build a Sequential model
model = keras.Sequential([
    # Add layers here
])

model.summary()`,
      71,
      "Python",
      [
        "Use layers.Dense(units, activation='relu', input_shape=(4,)) for the hidden layer.",
        "Add a second Dense(1, activation='sigmoid') as the output layer.",
        `model = keras.Sequential([\n    layers.Dense(8, activation='relu', input_shape=(4,)),\n    layers.Dense(1, activation='sigmoid')\n])\nmodel.summary()`,
      ],
      ["Sequential", "Dense", "relu", "sigmoid", "summary", "input_shape"],
    ),
  ],
};

// ─── ML: Model Evaluation ────────────────────────────────────────────────────
const ML_M1_P5: PartQuizData = {
  mcqs: [
    mcq(
      "mlm1p5-1",
      "Accuracy is calculated as:",
      ["TP / (TP + FP)", "(TP + TN) / Total", "TP / (TP + FN)", "FP / Total"],
      1,
      "Accuracy = (True Positives + True Negatives) / Total samples.",
    ),
    mcq(
      "mlm1p5-2",
      "Precision measures:",
      [
        "How many actual positives were found",
        "Of predicted positives, how many are truly positive",
        "Overall correctness",
        "Recall rate",
      ],
      1,
      "Precision = TP / (TP + FP) — it measures the quality of positive predictions.",
    ),
    mcq(
      "mlm1p5-3",
      "Recall (Sensitivity) measures:",
      [
        "Of predicted positives, how many are correct",
        "Of all actual positives, how many were found",
        "Overall accuracy",
        "False positive rate",
      ],
      1,
      "Recall = TP / (TP + FN) — how many actual positives the model correctly identified.",
    ),
    mcq(
      "mlm1p5-4",
      "The F1 Score is the:",
      [
        "Average of precision and recall",
        "Harmonic mean of precision and recall",
        "Sum of TP and TN",
        "Root mean squared error",
      ],
      1,
      "F1 = 2 × (Precision × Recall) / (Precision + Recall) — balances both metrics.",
    ),
    mcq(
      "mlm1p5-5",
      "A confusion matrix shows:",
      [
        "Model architecture",
        "TP, FP, FN, TN counts per class",
        "Training loss curve",
        "Feature importance",
      ],
      1,
      "A confusion matrix displays actual vs predicted class counts, revealing which classes are confused.",
    ),
    mcq(
      "mlm1p5-6",
      "True Positive (TP) means:",
      [
        "Model predicted negative, actual is positive",
        "Model predicted positive, actual is positive",
        "Model predicted positive, actual is negative",
        "Model predicted negative, actual is negative",
      ],
      1,
      "TP: model correctly predicted the positive class.",
    ),
    mcq(
      "mlm1p5-7",
      "False Positive (FP) is also known as:",
      ["Miss", "Type I error", "Type II error", "True alarm"],
      1,
      "FP (Type I error): model predicted positive but actual is negative — a false alarm.",
    ),
    mcq(
      "mlm1p5-8",
      "ROC-AUC score of 1.0 means:",
      [
        "Random classifier",
        "Perfect classifier",
        "Worst possible classifier",
        "50% accuracy",
      ],
      1,
      "AUC = 1.0 means the model perfectly separates positive and negative classes.",
    ),
    mcq(
      "mlm1p5-9",
      "Mean Squared Error (MSE) is used for:",
      [
        "Classification",
        "Clustering",
        "Regression evaluation",
        "Feature selection",
      ],
      2,
      "MSE measures average squared difference between predicted and actual values in regression.",
    ),
    mcq(
      "mlm1p5-10",
      "RMSE (Root MSE) is preferred over MSE because:",
      [
        "It's always smaller",
        "It's in the same units as the target variable",
        "It ignores outliers",
        "It's faster to compute",
      ],
      1,
      "RMSE is the square root of MSE, bringing the error back to the original unit scale.",
    ),
    mcq(
      "mlm1p5-11",
      "When classes are imbalanced, the best metric is:",
      ["Accuracy", "F1 Score or AUC-ROC", "MSE", "R-squared"],
      1,
      "With imbalanced classes, accuracy is misleading. F1 and AUC-ROC better reflect model quality.",
    ),
    mcq(
      "mlm1p5-12",
      "R² (R-squared) in regression measures:",
      [
        "Error magnitude",
        "How well model explains variance in the target",
        "Number of features",
        "Training time",
      ],
      1,
      "R² ranges 0-1; 1 means the model explains all variance; 0 means it explains none.",
    ),
    mcq(
      "mlm1p5-13",
      "Cross-entropy loss is used for:",
      [
        "Regression",
        "Clustering",
        "Classification",
        "Dimensionality reduction",
      ],
      2,
      "Cross-entropy loss measures the difference between predicted probability distribution and true labels in classification.",
    ),
    mcq(
      "mlm1p5-14",
      "Bias in ML models refers to:",
      [
        "Random noise in predictions",
        "Systematic error from overly simple models",
        "Data collection errors",
        "Computing bias values",
      ],
      1,
      "High bias (underfitting) means the model makes consistently wrong assumptions about the data.",
    ),
    mcq(
      "mlm1p5-15",
      "The bias-variance tradeoff means:",
      [
        "You must choose between precision and recall",
        "Reducing bias usually increases variance and vice versa",
        "Overfitting = high bias",
        "Underfitting = high variance",
      ],
      1,
      "Complex models have low bias but high variance (overfit); simple models have high bias but low variance.",
    ),
  ],
  programmingQuestions: [
    pq(
      "mlm1p5-pq1",
      "Compute Accuracy",
      "Write a Python function `compute_accuracy(y_true, y_pred)` that calculates classification accuracy given lists of true labels and predicted labels.",
      [{ input: "[1,0,1,1,0], [1,0,0,1,0]", output: "Accuracy: 0.8" }],
      `def compute_accuracy(y_true, y_pred):
    # Calculate accuracy: correct / total
    pass

print("Accuracy:", compute_accuracy([1,0,1,1,0], [1,0,0,1,0]))`,
      71,
      "Python",
      [
        "Count how many predictions match true labels, then divide by total count.",
        "Use sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true).",
        "correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)\nreturn correct / len(y_true)",
      ],
      ["def", "sum", "zip", "return", "len", "accuracy"],
    ),
    pq(
      "mlm1p5-pq2",
      "Confusion Matrix Builder",
      "Write a Python function `confusion_matrix_2x2(y_true, y_pred)` that returns a dict with TP, FP, FN, TN counts for binary classification.",
      [
        {
          input: "[1,0,1,1,0], [1,0,0,1,0]",
          output: "{'TP': 2, 'FP': 0, 'FN': 1, 'TN': 2}",
        },
      ],
      `def confusion_matrix_2x2(y_true, y_pred):
    tp = fp = fn = tn = 0
    # Count TP, FP, FN, TN
    pass

print(confusion_matrix_2x2([1,0,1,1,0], [1,0,0,1,0]))`,
      71,
      "Python",
      [
        "Loop through paired (true, pred) values and check each combination.",
        "TP: true=1,pred=1 | FP: true=0,pred=1 | FN: true=1,pred=0 | TN: true=0,pred=0",
        `for t, p in zip(y_true, y_pred):\n    if t==1 and p==1: tp+=1\n    elif t==0 and p==1: fp+=1\n    elif t==1 and p==0: fn+=1\n    else: tn+=1\nreturn {'TP': tp, 'FP': fp, 'FN': fn, 'TN': tn}`,
      ],
      ["def", "zip", "return", "TP", "FP", "FN", "TN"],
    ),
  ],
};

// ─── DEVOPS: Docker Basics ────────────────────────────────────────────────────
const DEVOPS_M1_P1: PartQuizData = {
  mcqs: [
    mcq(
      "dvm1p1-1",
      "Docker containers are:",
      [
        "Virtual machines with full OS",
        "Lightweight isolated processes sharing the host OS kernel",
        "Physical servers",
        "Cloud instances",
      ],
      1,
      "Containers share the host OS kernel and are more lightweight than VMs, which include full OS copies.",
    ),
    mcq(
      "dvm1p1-2",
      "A Docker image is:",
      [
        "A running container",
        "A read-only template used to create containers",
        "A virtual hard disk",
        "A Docker registry",
      ],
      1,
      "Images are immutable templates — containers are running instances of images.",
    ),
    mcq(
      "dvm1p1-3",
      "What is a Dockerfile?",
      [
        "A container log",
        "A script of instructions to build a Docker image",
        "A Docker CLI tool",
        "A container runtime",
      ],
      1,
      "A Dockerfile contains step-by-step instructions (FROM, RUN, COPY, CMD, etc.) to build an image.",
    ),
    mcq(
      "dvm1p1-4",
      "The FROM instruction in a Dockerfile:",
      [
        "Copies files",
        "Specifies the base image to build upon",
        "Runs a shell command",
        "Exposes a port",
      ],
      1,
      "FROM sets the base image — every Dockerfile starts with FROM (e.g., FROM node:18).",
    ),
    mcq(
      "dvm1p1-5",
      "RUN instruction in a Dockerfile:",
      [
        "Starts the container",
        "Executes commands during image build",
        "Copies local files to image",
        "Sets environment variables",
      ],
      1,
      "RUN executes shell commands during the build process to install packages, compile code, etc.",
    ),
    mcq(
      "dvm1p1-6",
      "COPY vs ADD in Dockerfile:",
      [
        "They are identical",
        "COPY only copies local files; ADD also handles URLs and tar extraction",
        "ADD is deprecated",
        "COPY handles remote URLs",
      ],
      1,
      "COPY is preferred for simple file copying; ADD has extra features (URL fetching, tar auto-extraction).",
    ),
    mcq(
      "dvm1p1-7",
      "CMD instruction sets:",
      [
        "Build commands",
        "The default command to run when a container starts",
        "Environment variables",
        "Port mappings",
      ],
      1,
      "CMD provides the default command executed when a container starts (can be overridden at runtime).",
    ),
    mcq(
      "dvm1p1-8",
      "EXPOSE instruction in Dockerfile:",
      [
        "Opens a firewall port",
        "Documents which port the app listens on (informational)",
        "Maps host port to container port",
        "Starts the service",
      ],
      1,
      "EXPOSE documents the intended port but doesn't publish it — use -p flag at runtime to publish.",
    ),
    mcq(
      "dvm1p1-9",
      "Docker Hub is:",
      [
        "A Docker CLI command",
        "A public registry for storing and sharing Docker images",
        "A container orchestration tool",
        "A monitoring service",
      ],
      1,
      "Docker Hub is the default public registry where users publish and pull Docker images.",
    ),
    mcq(
      "dvm1p1-10",
      "docker build command:",
      [
        "Runs a container",
        "Builds an image from a Dockerfile",
        "Lists containers",
        "Pulls an image",
      ],
      1,
      "docker build -t image_name . builds a Docker image from the Dockerfile in the current directory.",
    ),
    mcq(
      "dvm1p1-11",
      "docker run -d flag means:",
      [
        "Delete after exit",
        "Run container in detached (background) mode",
        "Dry run",
        "Debug mode",
      ],
      1,
      "-d (detached) runs the container in the background, returning the terminal to the user.",
    ),
    mcq(
      "dvm1p1-12",
      "docker ps command shows:",
      [
        "Available images",
        "Currently running containers",
        "Stopped containers only",
        "Docker system info",
      ],
      1,
      "docker ps lists currently running containers; docker ps -a shows all containers including stopped ones.",
    ),
    mcq(
      "dvm1p1-13",
      "Docker volumes are used to:",
      [
        "Increase container speed",
        "Persist data outside container lifecycle",
        "Connect containers",
        "Build images",
      ],
      1,
      "Volumes persist data beyond container lifetimes — data survives container removal.",
    ),
    mcq(
      "dvm1p1-14",
      "Docker Compose is used to:",
      [
        "Build single containers",
        "Define and run multi-container applications",
        "Push images to registry",
        "Monitor containers",
      ],
      1,
      "Docker Compose uses a YAML file to define and orchestrate multi-container app stacks.",
    ),
    mcq(
      "dvm1p1-15",
      "Container vs VM — the main advantage of containers is:",
      [
        "Better security isolation",
        "Lower overhead and faster startup due to shared OS kernel",
        "No need for networking",
        "Only run on Linux",
      ],
      1,
      "Containers start in milliseconds and use less memory because they don't include a full OS.",
    ),
  ],
  programmingQuestions: [
    pq(
      "dvm1p1-pq1",
      "Write a Dockerfile",
      "Write a Dockerfile for a Node.js application. It should: use node:18-alpine as the base image, set the working directory to /app, copy package.json, run npm install, copy all source files, expose port 3000, and start with npm start.",
      [{ input: "(none)", output: "Valid Dockerfile for Node.js app" }],
      `# Write a complete Dockerfile for a Node.js app
# Base image: node:18-alpine
# Working dir: /app
# Install deps, copy files, expose 3000, start with npm start
`,
      45,
      "Bash",
      [
        "Start with FROM node:18-alpine, then WORKDIR /app.",
        "Use COPY package.json ., RUN npm install, COPY . ., EXPOSE 3000.",
        `FROM node:18-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]`,
      ],
      ["FROM", "WORKDIR", "COPY", "RUN", "EXPOSE", "CMD", "npm"],
    ),
    pq(
      "dvm1p1-pq2",
      "Docker Run Commands",
      "Write the shell commands to: (1) build a Docker image named 'myapp' from current directory, (2) run it in detached mode mapping host port 8080 to container port 3000, (3) list running containers.",
      [{ input: "(none)", output: "3 Docker commands" }],
      `# Write three docker commands:
# 1. Build image tagged 'myapp'
# 2. Run in background, map 8080->3000
# 3. List running containers
`,
      45,
      "Bash",
      [
        "Build: docker build -t myapp .",
        "Run detached with port mapping: docker run -d -p 8080:3000 myapp",
        "docker build -t myapp .\ndocker run -d -p 8080:3000 myapp\ndocker ps",
      ],
      ["docker build", "docker run", "-d", "-p", "docker ps", "myapp"],
    ),
  ],
};

// ─── DEVOPS: CI/CD ───────────────────────────────────────────────────────────
const DEVOPS_M1_P2: PartQuizData = {
  mcqs: [
    mcq(
      "dvm1p2-1",
      "CI stands for:",
      [
        "Container Integration",
        "Continuous Integration",
        "Code Inspection",
        "Cloud Infrastructure",
      ],
      1,
      "Continuous Integration is the practice of frequently merging code changes and automatically building and testing them.",
    ),
    mcq(
      "dvm1p2-2",
      "CD (Continuous Delivery) means:",
      [
        "Code is automatically deployed to production on every commit",
        "Code is always in a deployable state; deployment is manual",
        "Continuous debugging",
        "Container delivery",
      ],
      1,
      "Continuous Delivery ensures code is always ready to deploy — the actual deployment may require manual approval.",
    ),
    mcq(
      "dvm1p2-3",
      "Continuous Deployment differs from Continuous Delivery by:",
      [
        "Nothing",
        "Automatically deploying every passing change to production",
        "Using different tools",
        "Requiring more testing",
      ],
      1,
      "Continuous Deployment auto-deploys every successful build to production without manual gates.",
    ),
    mcq(
      "dvm1p2-4",
      "A CI/CD pipeline typically includes:",
      [
        "Only manual testing",
        "Build → Test → Deploy stages",
        "Only deployment",
        "Just code reviews",
      ],
      1,
      "A typical pipeline: commit → build → automated tests → staging deploy → production deploy.",
    ),
    mcq(
      "dvm1p2-5",
      "GitHub Actions workflows are defined in:",
      [
        ".github/actions/",
        ".github/workflows/*.yml",
        "package.json scripts",
        "Makefile",
      ],
      1,
      "GitHub Actions workflows are YAML files in the .github/workflows/ directory.",
    ),
    mcq(
      "dvm1p2-6",
      "A job in GitHub Actions:",
      [
        "Is a single step",
        "Is a set of steps that run on the same runner",
        "Is a trigger event",
        "Is an artifact",
      ],
      1,
      "A job contains multiple steps and runs on a virtual machine (runner) in GitHub Actions.",
    ),
    mcq(
      "dvm1p2-7",
      "The 'on' keyword in GitHub Actions defines:",
      [
        "Steps to run",
        "Events that trigger the workflow",
        "Environment variables",
        "Runner type",
      ],
      1,
      "The 'on' key specifies which events (push, pull_request, schedule, etc.) trigger the workflow.",
    ),
    mcq(
      "dvm1p2-8",
      "Artifacts in CI/CD are:",
      [
        "Bug reports",
        "Build outputs (binaries, test reports) saved for later use",
        "Source code branches",
        "Environment variables",
      ],
      1,
      "Artifacts are files produced by a build (compiled code, test results) that can be downloaded or passed between jobs.",
    ),
    mcq(
      "dvm1p2-9",
      "A pipeline stage that fails:",
      [
        "Is ignored",
        "Usually blocks subsequent stages from running",
        "Restarts automatically",
        "Deploys anyway",
      ],
      1,
      "By default, if a stage fails (e.g., tests fail), the pipeline stops and subsequent stages don't run.",
    ),
    mcq(
      "dvm1p2-10",
      "Environment variables in CI/CD pipelines are used for:",
      [
        "Code comments",
        "Storing configuration and secrets securely",
        "Defining stages",
        "Version control",
      ],
      1,
      "Environment variables configure builds and store secrets (API keys, credentials) without hardcoding them.",
    ),
    mcq(
      "dvm1p2-11",
      "Blue-green deployment means:",
      [
        "Using two databases",
        "Running two identical environments and switching traffic between them",
        "Deploying blue code only",
        "A color-coded testing strategy",
      ],
      1,
      "Blue-green keeps two production environments — when deploying, switch traffic from blue (old) to green (new).",
    ),
    mcq(
      "dvm1p2-12",
      "A rollback in CD means:",
      [
        "Adding new features",
        "Reverting to a previous working version after a failed deployment",
        "Rolling out to more users",
        "Running tests again",
      ],
      1,
      "Rollback reverts production to the last stable version when a new deployment causes issues.",
    ),
    mcq(
      "dvm1p2-13",
      "Test automation in CI ensures:",
      [
        "Tests run faster manually",
        "Tests run automatically on every code change",
        "Fewer tests are needed",
        "Code is auto-fixed",
      ],
      1,
      "Automated tests run on every commit/PR, providing instant feedback on whether changes break anything.",
    ),
    mcq(
      "dvm1p2-14",
      "A runner in GitHub Actions is:",
      [
        "A workflow trigger",
        "The virtual machine that executes the workflow jobs",
        "A CI/CD stage",
        "A code review bot",
      ],
      1,
      "Runners are the computing environments (GitHub-hosted or self-hosted VMs) where jobs execute.",
    ),
    mcq(
      "dvm1p2-15",
      "Which tool is a popular CI/CD server?",
      ["GitHub Desktop", "Jenkins", "Postman", "VS Code"],
      1,
      "Jenkins is one of the most popular open-source CI/CD automation servers.",
    ),
  ],
  programmingQuestions: [
    pq(
      "dvm1p2-pq1",
      "Write a GitHub Actions Workflow",
      "Write a GitHub Actions YAML workflow that: triggers on push to main, uses ubuntu-latest runner, checks out code, sets up Node.js 18, runs npm install, and runs npm test.",
      [{ input: "(none)", output: "Valid .github/workflows/ci.yml" }],
      `# Write a complete GitHub Actions workflow YAML
# Trigger: push to main
# Steps: checkout, setup-node@v4 node 18, npm install, npm test
`,
      45,
      "Bash",
      [
        "Start with 'name:', then 'on: push: branches: [main]', then 'jobs:'.",
        "Use actions/checkout@v4 and actions/setup-node@v4 with node-version: 18.",
        "name: CI\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 18\n      - run: npm install\n      - run: npm test",
      ],
      [
        "name:",
        "on:",
        "push:",
        "jobs:",
        "runs-on",
        "uses:",
        "actions/checkout",
        "npm",
      ],
    ),
  ],
};

// ─── DEVOPS: Kubernetes ───────────────────────────────────────────────────────
const DEVOPS_M1_P3: PartQuizData = {
  mcqs: [
    mcq(
      "dvm1p3-1",
      "Kubernetes (K8s) is:",
      [
        "A container runtime",
        "A container orchestration platform",
        "A CI/CD tool",
        "A cloud provider",
      ],
      1,
      "Kubernetes automates deployment, scaling, and management of containerized applications.",
    ),
    mcq(
      "dvm1p3-2",
      "A Pod in Kubernetes is:",
      [
        "A cluster node",
        "The smallest deployable unit, containing one or more containers",
        "A service type",
        "A volume",
      ],
      1,
      "A Pod wraps one or more containers that share networking and storage — it's the basic K8s unit.",
    ),
    mcq(
      "dvm1p3-3",
      "A Kubernetes Deployment manages:",
      [
        "Individual pods manually",
        "A set of replica pods with rolling updates and rollback",
        "Only stateful apps",
        "Storage volumes",
      ],
      1,
      "Deployments maintain a desired number of Pod replicas and enable rolling updates and rollbacks.",
    ),
    mcq(
      "dvm1p3-4",
      "A Kubernetes Service provides:",
      [
        "Container builds",
        "Stable network endpoint to access a set of pods",
        "Storage persistence",
        "Node scheduling",
      ],
      1,
      "Services give pods a stable IP and DNS name, load balancing traffic across pod replicas.",
    ),
    mcq(
      "dvm1p3-5",
      "kubectl get pods shows:",
      [
        "Cluster config",
        "List of pods and their status",
        "Node resources",
        "Service endpoints",
      ],
      1,
      "kubectl get pods lists all pods in the current namespace with their running status.",
    ),
    mcq(
      "dvm1p3-6",
      "A Namespace in Kubernetes:",
      [
        "Is a container network",
        "Provides logical isolation for resources within a cluster",
        "Is a storage class",
        "Is a node type",
      ],
      1,
      "Namespaces allow multiple teams or environments to share a cluster with isolated resource scopes.",
    ),
    mcq(
      "dvm1p3-7",
      "A ConfigMap stores:",
      [
        "Container images",
        "Non-sensitive configuration data as key-value pairs",
        "Encrypted secrets",
        "Pod logs",
      ],
      1,
      "ConfigMaps hold configuration data that can be injected into pods as env vars or mounted files.",
    ),
    mcq(
      "dvm1p3-8",
      "A Secret in Kubernetes stores:",
      [
        "Pod replicas count",
        "Sensitive data like passwords and API keys in base64 format",
        "Container images",
        "Service endpoints",
      ],
      1,
      "Secrets store sensitive data (passwords, tokens, keys) separately from application code.",
    ),
    mcq(
      "dvm1p3-9",
      "Horizontal Pod Autoscaler (HPA) automatically:",
      [
        "Increases node size",
        "Scales pod replicas based on CPU/memory metrics",
        "Creates new namespaces",
        "Restarts crashed pods",
      ],
      1,
      "HPA dynamically adjusts the number of pod replicas based on observed resource utilization.",
    ),
    mcq(
      "dvm1p3-10",
      "A LoadBalancer service type:",
      [
        "Provides internal cluster access only",
        "Exposes a service externally using a cloud load balancer",
        "Stores persistent data",
        "Monitors pod health",
      ],
      1,
      "LoadBalancer provisions an external cloud load balancer to expose the service to the internet.",
    ),
    mcq(
      "dvm1p3-11",
      "Rolling update strategy in Kubernetes:",
      [
        "Terminates all pods then starts new ones",
        "Gradually replaces old pods with new ones to minimize downtime",
        "Duplicates the cluster",
        "Skips testing",
      ],
      1,
      "Rolling updates replace pods incrementally, ensuring the app stays available during deployment.",
    ),
    mcq(
      "dvm1p3-12",
      "A PersistentVolume (PV) in K8s:",
      [
        "Is a pod type",
        "Provides durable storage independent of pod lifecycle",
        "Is a network policy",
        "Is a secret type",
      ],
      1,
      "PVs provide cluster storage that persists independently of pods — data survives pod restarts.",
    ),
    mcq(
      "dvm1p3-13",
      "kubectl apply -f applies:",
      [
        "A new namespace",
        "A YAML or JSON resource manifest to the cluster",
        "A cluster upgrade",
        "Pod health checks",
      ],
      1,
      "kubectl apply -f file.yaml creates or updates K8s resources defined in the manifest.",
    ),
    mcq(
      "dvm1p3-14",
      "Liveness probe in Kubernetes:",
      [
        "Autoscales pods",
        "Checks if a container is alive; restarts it if the check fails",
        "Monitors network traffic",
        "Manages secrets",
      ],
      1,
      "Liveness probes detect stuck containers and trigger automatic restarts to keep apps healthy.",
    ),
    mcq(
      "dvm1p3-15",
      "The control plane in Kubernetes includes:",
      [
        "Worker nodes only",
        "API server, scheduler, controller manager, etcd",
        "Only etcd",
        "Only worker nodes",
      ],
      1,
      "The control plane (API server, scheduler, controller manager, etcd) manages the cluster state.",
    ),
  ],
  programmingQuestions: [
    pq(
      "dvm1p3-pq1",
      "Write a Kubernetes Deployment YAML",
      "Write a Kubernetes Deployment manifest YAML for an app named 'webserver' using nginx:latest image with 3 replicas, container port 80, and the label app: webserver.",
      [{ input: "(none)", output: "Valid K8s Deployment YAML" }],
      `# Write a complete Kubernetes Deployment YAML manifest
# Name: webserver, Image: nginx:latest, Replicas: 3, Port: 80
`,
      45,
      "Bash",
      [
        "Start with apiVersion: apps/v1, kind: Deployment, metadata: name: webserver.",
        "In spec: set replicas: 3, selector matchLabels app: webserver, template with containers.",
        "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: webserver\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: webserver\n  template:\n    metadata:\n      labels:\n        app: webserver\n    spec:\n      containers:\n      - name: webserver\n        image: nginx:latest\n        ports:\n        - containerPort: 80",
      ],
      [
        "apiVersion",
        "kind: Deployment",
        "replicas",
        "selector",
        "containers",
        "image",
        "nginx",
      ],
    ),
  ],
};

// ─── DEVOPS: Monitoring ───────────────────────────────────────────────────────
const DEVOPS_M1_P4: PartQuizData = {
  mcqs: [
    mcq(
      "dvm1p4-1",
      "Prometheus is primarily used for:",
      [
        "Log aggregation",
        "Metrics collection and alerting",
        "Container orchestration",
        "CI/CD pipelines",
      ],
      1,
      "Prometheus scrapes and stores time-series metrics and supports alerting rules.",
    ),
    mcq(
      "dvm1p4-2",
      "Grafana is used to:",
      [
        "Collect metrics",
        "Visualize metrics data through dashboards",
        "Deploy containers",
        "Build CI pipelines",
      ],
      1,
      "Grafana creates visual dashboards by querying data sources like Prometheus.",
    ),
    mcq(
      "dvm1p4-3",
      "A metric in monitoring is:",
      [
        "A deployment strategy",
        "A measurable value observed over time",
        "A log entry",
        "A security alert",
      ],
      1,
      "Metrics are numeric measurements (CPU %, request latency, error rate) tracked over time.",
    ),
    mcq(
      "dvm1p4-4",
      "Alerting in Prometheus is defined via:",
      [
        "Dashboard panels",
        "Alerting rules in rule files using PromQL",
        "Grafana only",
        "Log files",
      ],
      1,
      "Prometheus alerting rules use PromQL expressions; when thresholds are breached, alerts fire.",
    ),
    mcq(
      "dvm1p4-5",
      "MTTR stands for:",
      [
        "Mean Time to Release",
        "Mean Time to Recover/Repair",
        "Maximum Total Traffic Rate",
        "Minimum Test to Release",
      ],
      1,
      "MTTR (Mean Time to Recover) measures how quickly a system recovers after an incident.",
    ),
    mcq(
      "dvm1p4-6",
      "SLA (Service Level Agreement) defines:",
      [
        "Internal code standards",
        "Committed service performance levels agreed with customers",
        "Deployment frequency",
        "Test coverage requirements",
      ],
      1,
      "SLAs are contracts specifying minimum service levels (e.g., 99.9% uptime) promised to customers.",
    ),
    mcq(
      "dvm1p4-7",
      "Distributed tracing tracks:",
      [
        "Server CPU only",
        "Request flow across multiple microservices",
        "Storage usage",
        "Network packets only",
      ],
      1,
      "Distributed tracing follows a single request as it moves through multiple services, identifying bottlenecks.",
    ),
    mcq(
      "dvm1p4-8",
      "ELK Stack stands for:",
      [
        "Elastic Load Kibana",
        "Elasticsearch Logstash Kibana",
        "Event Log Kubernetes",
        "Enterprise Linux Kubernetes",
      ],
      1,
      "ELK Stack = Elasticsearch (storage/search) + Logstash (ingestion) + Kibana (visualization) for log management.",
    ),
    mcq(
      "dvm1p4-9",
      "Health checks in Kubernetes/monitoring verify:",
      [
        "Code quality",
        "Whether a service is running and responding correctly",
        "Deployment speed",
        "Secret rotation",
      ],
      1,
      "Health checks (liveness/readiness probes) verify service availability and trigger recovery actions.",
    ),
    mcq(
      "dvm1p4-10",
      "RED method for monitoring tracks:",
      [
        "Resources, Events, Duration",
        "Rate, Errors, Duration",
        "Requests, Errors, Deployments",
        "Runtime, Exceptions, Debug",
      ],
      1,
      "RED (Rate, Errors, Duration) is a methodology for monitoring request-based services.",
    ),
    mcq(
      "dvm1p4-11",
      "The USE method monitors:",
      [
        "Users, Servers, Events",
        "Utilization, Saturation, Errors",
        "Updates, Services, Errors",
        "Uptime, Speed, Efficiency",
      ],
      1,
      "USE (Utilization, Saturation, Errors) focuses on resource performance metrics.",
    ),
    mcq(
      "dvm1p4-12",
      "Log levels (in order of severity):",
      [
        "INFO > WARN > ERROR > DEBUG",
        "DEBUG < INFO < WARN < ERROR < FATAL",
        "ERROR > INFO > DEBUG",
        "FATAL < ERROR < WARN",
      ],
      1,
      "Standard log severity: DEBUG (lowest) → INFO → WARN → ERROR → FATAL (highest).",
    ),
    mcq(
      "dvm1p4-13",
      "An SLO (Service Level Objective) is:",
      [
        "A legal document",
        "A target value for a service metric (e.g., 99.9% availability)",
        "A monitoring tool",
        "A deployment strategy",
      ],
      1,
      "SLOs are specific measurable targets for service performance, used internally to guide reliability work.",
    ),
    mcq(
      "dvm1p4-14",
      "Cardinality in metrics refers to:",
      [
        "Number of metrics collected",
        "Number of unique label combinations",
        "Data volume",
        "Alert count",
      ],
      1,
      "High cardinality (many unique label values) can cause storage and performance issues in time-series databases.",
    ),
    mcq(
      "dvm1p4-15",
      "Incident management involves:",
      [
        "Only fixing bugs in code",
        "Detecting, responding to, resolving, and learning from outages",
        "Automating deployments",
        "Writing documentation",
      ],
      1,
      "Incident management covers the full lifecycle: detect → respond → mitigate → resolve → postmortem.",
    ),
  ],
  programmingQuestions: [
    pq(
      "dvm1p4-pq1",
      "Write a Prometheus Alerting Rule",
      "Write a Prometheus alerting rule YAML that fires a 'HighCPUUsage' alert when node_cpu_usage_percent > 80 for more than 5 minutes, with severity label 'warning'.",
      [{ input: "(none)", output: "Valid Prometheus alerting rule" }],
      `# Write a Prometheus alerting rule YAML
# Alert: HighCPUUsage
# Condition: node_cpu_usage_percent > 80
# For: 5 minutes, Severity: warning
`,
      45,
      "Bash",
      [
        "Use groups: - name: with rules: - alert: HighCPUUsage.",
        "Set expr: node_cpu_usage_percent > 80, for: 5m, labels: severity: warning.",
        `groups:\n- name: cpu_alerts\n  rules:\n  - alert: HighCPUUsage\n    expr: node_cpu_usage_percent > 80\n    for: 5m\n    labels:\n      severity: warning\n    annotations:\n      summary: "High CPU usage detected"`,
      ],
      ["groups:", "alert:", "expr:", "for:", "labels:", "severity:", "warning"],
    ),
  ],
};

// ─── DEVOPS: Infrastructure as Code ──────────────────────────────────────────
const DEVOPS_M1_P5: PartQuizData = {
  mcqs: [
    mcq(
      "dvm1p5-1",
      "Infrastructure as Code (IaC) means:",
      [
        "Writing app code only",
        "Managing infrastructure through machine-readable config files",
        "Manual server setup",
        "Container configuration",
      ],
      1,
      "IaC treats infrastructure configuration as code — versioned, reviewable, and automated.",
    ),
    mcq(
      "dvm1p5-2",
      "Terraform is:",
      [
        "A CI/CD tool",
        "An infrastructure provisioning tool using declarative config",
        "A container runtime",
        "A monitoring tool",
      ],
      1,
      "Terraform (by HashiCorp) provisions infrastructure across cloud providers using HCL config files.",
    ),
    mcq(
      "dvm1p5-3",
      "Ansible is used for:",
      [
        "Container orchestration",
        "Configuration management and application deployment",
        "Load balancing",
        "Log aggregation",
      ],
      1,
      "Ansible automates configuration management, app deployment, and task execution using YAML playbooks.",
    ),
    mcq(
      "dvm1p5-4",
      "Terraform's main config file extension is:",
      [".json", ".yaml", ".tf", ".toml"],
      2,
      "Terraform configuration is written in HCL (HashiCorp Configuration Language) in .tf files.",
    ),
    mcq(
      "dvm1p5-5",
      "terraform init command:",
      [
        "Destroys infrastructure",
        "Initializes the working directory and downloads providers",
        "Applies changes",
        "Shows the execution plan",
      ],
      1,
      "terraform init downloads the required provider plugins and sets up the backend.",
    ),
    mcq(
      "dvm1p5-6",
      "terraform plan shows:",
      [
        "Terraform version",
        "What changes will be made without applying them",
        "Current state",
        "Provider info",
      ],
      1,
      "terraform plan creates an execution plan, previewing what infrastructure changes will be made.",
    ),
    mcq(
      "dvm1p5-7",
      "terraform apply:",
      [
        "Only shows changes",
        "Executes the planned infrastructure changes",
        "Destroys all resources",
        "Initializes providers",
      ],
      1,
      "terraform apply executes the plan and creates/modifies/deletes infrastructure as defined.",
    ),
    mcq(
      "dvm1p5-8",
      "Terraform state file records:",
      [
        "Source code",
        "The current state of managed infrastructure resources",
        "Credentials",
        "Test results",
      ],
      1,
      "The state file (terraform.tfstate) tracks the real-world resources Terraform manages.",
    ),
    mcq(
      "dvm1p5-9",
      "An Ansible Playbook is:",
      [
        "A Python script",
        "A YAML file defining tasks to execute on target hosts",
        "A Dockerfile",
        "A Kubernetes manifest",
      ],
      1,
      "Playbooks define ordered sets of tasks that Ansible runs on specified hosts.",
    ),
    mcq(
      "dvm1p5-10",
      "Immutable infrastructure means:",
      [
        "Infrastructure that never changes",
        "Replacing servers entirely instead of modifying them in place",
        "Infrastructure with no updates",
        "Read-only storage",
      ],
      1,
      "Immutable infrastructure replaces (rather than patches) servers to ensure consistency and predictability.",
    ),
    mcq(
      "dvm1p5-11",
      "Terraform modules are:",
      [
        "Terraform commands",
        "Reusable packages of Terraform configurations",
        "Cloud regions",
        "Service accounts",
      ],
      1,
      "Modules group Terraform resources for reuse — similar to functions in programming.",
    ),
    mcq(
      "dvm1p5-12",
      "Desired state configuration means:",
      [
        "Manual configuration",
        "Declaratively specifying what the infrastructure should look like",
        "Logging current state",
        "Imperative commands",
      ],
      1,
      "IaC tools like Terraform are declarative — you describe the desired state and the tool makes it happen.",
    ),
    mcq(
      "dvm1p5-13",
      "Puppet and Chef are examples of:",
      [
        "Container tools",
        "Configuration management tools",
        "CI/CD servers",
        "Load balancers",
      ],
      1,
      "Puppet and Chef are configuration management tools that ensure servers maintain a desired state.",
    ),
    mcq(
      "dvm1p5-14",
      "The main benefit of IaC is:",
      [
        "Slower provisioning",
        "Consistency, repeatability, and version control of infrastructure",
        "More manual work",
        "Higher costs",
      ],
      1,
      "IaC enables consistent, repeatable, and version-controlled infrastructure provisioning.",
    ),
    mcq(
      "dvm1p5-15",
      "Remote state in Terraform enables:",
      [
        "Local state only",
        "Teams to share and collaborate on the same infrastructure state",
        "Faster builds",
        "Smaller state files",
      ],
      1,
      "Remote state backends (S3, Terraform Cloud) allow teams to share state safely with locking.",
    ),
  ],
  programmingQuestions: [
    pq(
      "dvm1p5-pq1",
      "Write a Terraform Configuration",
      "Write a Terraform configuration (.tf) that defines an AWS S3 bucket named 'my-app-bucket' with versioning enabled. Include the required AWS provider block.",
      [
        {
          input: "(none)",
          output: "Valid Terraform HCL for S3 bucket with versioning",
        },
      ],
      `# Write Terraform HCL to create an AWS S3 bucket
# Bucket name: my-app-bucket
# Enable versioning
# Include AWS provider block
`,
      45,
      "Bash",
      [
        "Start with terraform { required_providers { aws = { source = 'hashicorp/aws' } } }",
        "Add provider 'aws' { region = 'us-east-1' } and resource 'aws_s3_bucket'.",
        `terraform {\n  required_providers {\n    aws = { source = "hashicorp/aws" }\n  }\n}\nprovider "aws" {\n  region = "us-east-1"\n}\nresource "aws_s3_bucket" "app_bucket" {\n  bucket = "my-app-bucket"\n}\nresource "aws_s3_bucket_versioning" "app_bucket" {\n  bucket = aws_s3_bucket.app_bucket.id\n  versioning_configuration {\n    status = "Enabled"\n  }\n}`,
      ],
      [
        "terraform",
        "required_providers",
        "provider",
        "aws",
        "resource",
        "aws_s3_bucket",
        "versioning",
      ],
    ),
  ],
};

// ─── ANDROID: Android Basics ──────────────────────────────────────────────────
const ANDROID_M1_P1: PartQuizData = {
  mcqs: [
    mcq(
      "andm1p1-1",
      "An Activity in Android represents:",
      [
        "A background service",
        "A single screen with a user interface",
        "A database table",
        "A network request",
      ],
      1,
      "An Activity is a single screen — the entry point for user interaction in Android apps.",
    ),
    mcq(
      "andm1p1-2",
      "The Android Activity lifecycle method called when first created is:",
      ["onStart()", "onResume()", "onCreate()", "onPause()"],
      2,
      "onCreate() is called when the activity is first created — this is where you initialize UI components.",
    ),
    mcq(
      "andm1p1-3",
      "onPause() is called when:",
      [
        "Activity is first created",
        "Activity is partially obscured by another activity",
        "Activity is destroyed",
        "Activity is invisible",
      ],
      1,
      "onPause() is called when the activity loses focus (another activity comes to the foreground partially).",
    ),
    mcq(
      "andm1p1-4",
      "An Intent in Android is used to:",
      [
        "Define UI layouts",
        "Start activities, services, or broadcast messages",
        "Store data",
        "Draw graphics",
      ],
      1,
      "Intents are messaging objects used to request actions from other app components.",
    ),
    mcq(
      "andm1p1-5",
      "Explicit Intent specifies:",
      [
        "No target component",
        "The exact component (class) to start",
        "System-wide broadcasts",
        "Database queries",
      ],
      1,
      "Explicit Intents specify the exact component (class name) to start — used for in-app navigation.",
    ),
    mcq(
      "andm1p1-6",
      "Implicit Intent specifies:",
      [
        "Exact component to start",
        "An action that any capable app can handle",
        "Only system services",
        "Background tasks",
      ],
      1,
      "Implicit Intents declare an action (e.g., view a URL) and let Android find the best component to handle it.",
    ),
    mcq(
      "andm1p1-7",
      "AndroidManifest.xml declares:",
      [
        "UI layouts",
        "App components, permissions, and app metadata",
        "Database schemas",
        "Network configs",
      ],
      1,
      "AndroidManifest.xml is the app's configuration file — it registers activities, services, permissions, etc.",
    ),
    mcq(
      "andm1p1-8",
      "The R class in Android:",
      [
        "Is a runtime class",
        "Provides references to all app resources (layouts, strings, drawables)",
        "Is a network library",
        "Handles permissions",
      ],
      1,
      "R.java is auto-generated and maps resource names to integer IDs for use in code.",
    ),
    mcq(
      "andm1p1-9",
      "setContentView() in onCreate():",
      [
        "Starts a new activity",
        "Sets the layout XML file for the activity to display",
        "Saves instance state",
        "Requests permissions",
      ],
      1,
      "setContentView(R.layout.activity_main) inflates and sets the XML layout for the activity.",
    ),
    mcq(
      "andm1p1-10",
      "Bundle savedInstanceState in onCreate() is used for:",
      [
        "Starting new activities",
        "Restoring activity state after rotation or system kill",
        "Database access",
        "Network calls",
      ],
      1,
      "savedInstanceState holds saved UI state from onSaveInstanceState() to restore after recreation.",
    ),
    mcq(
      "andm1p1-11",
      "onDestroy() is called when:",
      [
        "Activity starts",
        "Activity is finishing or being killed by the system",
        "Activity is paused",
        "Activity is resumed",
      ],
      1,
      "onDestroy() is the final lifecycle callback — called before the activity is completely removed.",
    ),
    mcq(
      "andm1p1-12",
      "Kotlin is preferred for Android because:",
      [
        "It's older than Java",
        "It's concise, null-safe, and officially recommended by Google",
        "It's faster than all languages",
        "It replaces XML",
      ],
      1,
      "Google officially recommends Kotlin for Android — it's more concise and has null safety built in.",
    ),
    mcq(
      "andm1p1-13",
      "A Fragment in Android is:",
      [
        "A full screen activity",
        "A reusable portion of UI within an Activity",
        "A background service",
        "A layout file",
      ],
      1,
      "Fragments are modular UI components that can be combined in an activity for flexible layouts.",
    ),
    mcq(
      "andm1p1-14",
      "The Back Stack in Android maintains:",
      [
        "Database records",
        "The history of activity instances for back navigation",
        "Pending intents",
        "Fragments only",
      ],
      1,
      "The back stack tracks launched activities — pressing back pops and finishes the top activity.",
    ),
    mcq(
      "andm1p1-15",
      "Gradle in Android is:",
      [
        "A UI library",
        "The build system that compiles and packages the app",
        "A testing framework",
        "A design tool",
      ],
      1,
      "Gradle is Android's build system — it compiles code, manages dependencies, and creates APK/AAB files.",
    ),
  ],
  programmingQuestions: [
    pq(
      "andm1p1-pq1",
      "Activity Lifecycle Code",
      "Write a Kotlin Activity class that overrides onCreate(), onPause(), onResume(), and onDestroy(), each printing its method name using Log.d() with tag 'LifecycleDemo'.",
      [
        {
          input: "(none)",
          output: "Kotlin Activity with all 4 lifecycle methods",
        },
      ],
      `// Write a Kotlin Activity with lifecycle methods
// Override: onCreate, onPause, onResume, onDestroy
// Each should Log.d("LifecycleDemo", "methodName called")
`,
      71,
      "Kotlin",
      [
        "Extend AppCompatActivity and call super for each override.",
        "Use Log.d(TAG, 'onCreate called') in each lifecycle method.",
        `class MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        Log.d("LifecycleDemo", "onCreate called")\n    }\n    override fun onPause() { super.onPause(); Log.d("LifecycleDemo", "onPause called") }\n    override fun onResume() { super.onResume(); Log.d("LifecycleDemo", "onResume called") }\n    override fun onDestroy() { super.onDestroy(); Log.d("LifecycleDemo", "onDestroy called") }\n}`,
      ],
      [
        "AppCompatActivity",
        "override",
        "onCreate",
        "onPause",
        "onResume",
        "onDestroy",
        "Log.d",
      ],
    ),
    pq(
      "andm1p1-pq2",
      "Intent Navigation",
      "Write Kotlin code inside a button click handler that creates an explicit Intent to navigate from MainActivity to DetailActivity, passing a String extra with key 'item_name' and value 'Android Basics'.",
      [
        {
          input: "(none)",
          output: "Kotlin explicit Intent code with string extra",
        },
      ],
      `// Write code to navigate from MainActivity to DetailActivity
// Pass extra: key="item_name", value="Android Basics"
// This goes inside a button's setOnClickListener
`,
      71,
      "Kotlin",
      [
        "Create Intent(this, DetailActivity::class.java) for explicit navigation.",
        "Use intent.putExtra('item_name', 'Android Basics') before startActivity(intent).",
        `val intent = Intent(this, DetailActivity::class.java)\nintent.putExtra("item_name", "Android Basics")\nstartActivity(intent)`,
      ],
      ["Intent", "DetailActivity", "putExtra", "startActivity", "item_name"],
    ),
  ],
};

// ─── ANDROID: Layouts ─────────────────────────────────────────────────────────
const ANDROID_M1_P2: PartQuizData = {
  mcqs: [
    mcq(
      "andm1p2-1",
      "ConstraintLayout is preferred because:",
      [
        "It's the oldest layout",
        "It allows flexible positioning with flat view hierarchy",
        "It requires XML only",
        "It's only for lists",
      ],
      1,
      "ConstraintLayout enables responsive designs with a flat hierarchy, improving performance over nested layouts.",
    ),
    mcq(
      "andm1p2-2",
      "LinearLayout arranges views:",
      [
        "In a grid",
        "Horizontally or vertically in a single line",
        "Relative to each other",
        "Only horizontally",
      ],
      1,
      "LinearLayout places views one after another either horizontally or vertically.",
    ),
    mcq(
      "andm1p2-3",
      "RecyclerView is used for:",
      [
        "Displaying single items",
        "Efficiently displaying large lists by recycling views",
        "Drawing custom graphics",
        "Only horizontal lists",
      ],
      1,
      "RecyclerView recycles views as you scroll, making it memory-efficient for long lists.",
    ),
    mcq(
      "andm1p2-4",
      "An Adapter in RecyclerView:",
      [
        "Draws the layout XML",
        "Binds data to ViewHolder items",
        "Manages scroll events",
        "Handles click events automatically",
      ],
      1,
      "The Adapter creates ViewHolder instances and binds data items to them for display.",
    ),
    mcq(
      "andm1p2-5",
      "ViewHolder pattern in RecyclerView:",
      [
        "Creates a new view each time",
        "Caches view references to avoid repeated findViewById() calls",
        "Manages list data",
        "Handles animations only",
      ],
      1,
      "ViewHolder caches view references, avoiding expensive findViewById() on each bind.",
    ),
    mcq(
      "andm1p2-6",
      "dp (density-independent pixels) is used for:",
      [
        "Text sizes",
        "Dimensions that scale correctly across screen densities",
        "Color values",
        "Font weights",
      ],
      1,
      "dp is the recommended unit for dimensions — 1dp = 1px on 160dpi screens, scaling on others.",
    ),
    mcq(
      "andm1p2-7",
      "sp (scale-independent pixels) is used for:",
      [
        "Image sizes",
        "Text sizes, also respecting user font size preferences",
        "Margins only",
        "Layout weights",
      ],
      1,
      "sp is like dp but also scales with user's font size accessibility setting — always use sp for text.",
    ),
    mcq(
      "andm1p2-8",
      "match_parent means a view's size:",
      [
        "Wraps its content",
        "Matches the parent container's size",
        "Is 0dp",
        "Is fixed",
      ],
      1,
      "match_parent expands the view to fill its parent container's width or height.",
    ),
    mcq(
      "andm1p2-9",
      "wrap_content means:",
      [
        "View fills parent",
        "View sizes itself to exactly fit its content",
        "View is hidden",
        "View uses 50% of parent",
      ],
      1,
      "wrap_content makes the view only as large as needed to contain its content.",
    ),
    mcq(
      "andm1p2-10",
      "LayoutManager in RecyclerView determines:",
      [
        "Data binding",
        "How items are laid out (linear, grid, staggered)",
        "Click handling",
        "Adapter type",
      ],
      1,
      "LayoutManager controls item arrangement — LinearLayoutManager (list), GridLayoutManager (grid), etc.",
    ),
    mcq(
      "andm1p2-11",
      "RelativeLayout positions views:",
      [
        "In a stack",
        "Relative to parent or other sibling views",
        "Only in a grid",
        "Only horizontally",
      ],
      1,
      "RelativeLayout positions views relative to their parent or to other views in the layout.",
    ),
    mcq(
      "andm1p2-12",
      "FrameLayout is typically used for:",
      [
        "Lists",
        "Overlapping views, often as a container for a single fragment",
        "Forms",
        "Grids",
      ],
      1,
      "FrameLayout stacks views on top of each other — commonly used as a fragment container.",
    ),
    mcq(
      "andm1p2-13",
      "XML layout files in Android are placed in:",
      ["res/layout/", "src/main/java/", "res/drawable/", "res/values/"],
      0,
      "Layout XML files go in the res/layout/ directory and are referenced via R.layout.filename.",
    ),
    mcq(
      "andm1p2-14",
      "Margin in Android layouts:",
      [
        "Padding inside the view",
        "Space outside the view border, between the view and surrounding elements",
        "View background color",
        "Text padding",
      ],
      1,
      "Margin adds space outside the view's boundary; padding adds space inside.",
    ),
    mcq(
      "andm1p2-15",
      "GridLayoutManager in RecyclerView displays items:",
      [
        "In a single vertical list",
        "In a grid with a specified number of columns",
        "In a staggered layout",
        "Horizontally only",
      ],
      1,
      "GridLayoutManager arranges RecyclerView items in a grid with a configurable column count.",
    ),
  ],
  programmingQuestions: [
    pq(
      "andm1p2-pq1",
      "RecyclerView Adapter Setup",
      "Write a Kotlin RecyclerView.Adapter class named 'FruitAdapter' that takes a List<String> of fruit names. The ViewHolder should hold a TextView. Implement onCreateViewHolder, onBindViewHolder, and getItemCount.",
      [{ input: "(none)", output: "Complete Kotlin RecyclerView.Adapter" }],
      `// Write a complete Kotlin RecyclerView.Adapter for a list of String items
// ViewHolder: holds a TextView
// Bind: set textView.text = item
`,
      71,
      "Kotlin",
      [
        "Extend RecyclerView.Adapter<FruitAdapter.ViewHolder> and define inner class ViewHolder(view: View).",
        "ViewHolder holds itemView.findViewById<TextView>(R.id.textItem).",
        "class FruitAdapter(private val fruits: List<String>) : RecyclerView.Adapter<FruitAdapter.ViewHolder>() {\n    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {\n        val textView: TextView = view.findViewById(R.id.textItem)\n    }\n    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {\n        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_fruit, parent, false)\n        return ViewHolder(view)\n    }\n    override fun onBindViewHolder(holder: ViewHolder, position: Int) {\n        holder.textView.text = fruits[position]\n    }\n    override fun getItemCount() = fruits.size\n}",
      ],
      [
        "RecyclerView.Adapter",
        "ViewHolder",
        "onCreateViewHolder",
        "onBindViewHolder",
        "getItemCount",
        "TextView",
      ],
    ),
    pq(
      "andm1p2-pq2",
      "ConstraintLayout XML",
      "Write an XML ConstraintLayout snippet with: a TextView (id: title) constrained to top of parent with 16dp margin, and a Button (id: btn_action) below the TextView with 8dp top margin, both centered horizontally.",
      [
        {
          input: "(none)",
          output: "Valid ConstraintLayout XML with TextView and Button",
        },
      ],
      `<!-- Write a ConstraintLayout with:
     - TextView id=title, constrained to top parent (16dp margin), centered
     - Button id=btn_action, below title (8dp margin), centered -->
`,
      45,
      "Bash",
      [
        "Use app:layout_constraintTop_toTopOf='parent' and app:layout_constraintStart/End_toStart/EndOf='parent' for centering.",
        "For the button, use app:layout_constraintTop_toBottomOf='@id/title'.",
        `<androidx.constraintlayout.widget.ConstraintLayout ...>\n  <TextView\n    android:id="@+id/title"\n    android:layout_marginTop="16dp"\n    app:layout_constraintTop_toTopOf="parent"\n    app:layout_constraintStart_toStartOf="parent"\n    app:layout_constraintEnd_toEndOf="parent" />\n  <Button\n    android:id="@+id/btn_action"\n    android:layout_marginTop="8dp"\n    app:layout_constraintTop_toBottomOf="@id/title"\n    app:layout_constraintStart_toStartOf="parent"\n    app:layout_constraintEnd_toEndOf="parent" />\n</androidx.constraintlayout.widget.ConstraintLayout>`,
      ],
      [
        "ConstraintLayout",
        "TextView",
        "Button",
        "constraintTop_toTopOf",
        "constraintTop_toBottomOf",
        "margin",
      ],
    ),
  ],
};

// ─── ANDROID: Jetpack Compose ─────────────────────────────────────────────────
const ANDROID_M1_P3: PartQuizData = {
  mcqs: [
    mcq(
      "andm1p3-1",
      "Jetpack Compose is:",
      [
        "An XML layout system",
        "Android's modern declarative UI toolkit",
        "A database library",
        "A testing framework",
      ],
      1,
      "Compose is Android's modern toolkit for building native UI with Kotlin and declarative functions.",
    ),
    mcq(
      "andm1p3-2",
      "A Composable function in Compose is:",
      [
        "A regular Kotlin function",
        "A @Composable annotated function that describes UI",
        "An Activity subclass",
        "A layout XML file",
      ],
      1,
      "Composables are @Composable-annotated Kotlin functions that emit UI elements.",
    ),
    mcq(
      "andm1p3-3",
      "State in Compose is managed with:",
      [
        "XML attributes",
        "remember { mutableStateOf() }",
        "SharedPreferences only",
        "ViewModels only",
      ],
      1,
      "remember { mutableStateOf(value) } creates state that persists across recompositions.",
    ),
    mcq(
      "andm1p3-4",
      "Recomposition in Compose means:",
      [
        "Activity recreation",
        "Composables re-execute when their state changes",
        "XML inflation",
        "View recycling",
      ],
      1,
      "When state changes, Compose automatically re-runs affected composables to update the UI.",
    ),
    mcq(
      "andm1p3-5",
      "Modifier in Compose is used to:",
      [
        "Only set colors",
        "Decorate or configure composables (size, padding, clicks, etc.)",
        "Define data classes",
        "Create animations only",
      ],
      1,
      "Modifiers chain-configure composables: padding, size, background, click handlers, etc.",
    ),
    mcq(
      "andm1p3-6",
      "Column composable in Compose:",
      [
        "Arranges items horizontally",
        "Arranges items vertically in a column",
        "Creates a grid",
        "Shows one item at a time",
      ],
      1,
      "Column arranges its children vertically, similar to LinearLayout with vertical orientation.",
    ),
    mcq(
      "andm1p3-7",
      "Row composable in Compose:",
      [
        "Arranges items vertically",
        "Arranges items horizontally",
        "Creates a lazy list",
        "Handles scrolling",
      ],
      1,
      "Row arranges its children horizontally, similar to LinearLayout with horizontal orientation.",
    ),
    mcq(
      "andm1p3-8",
      "LazyColumn in Compose is equivalent to:",
      ["FrameLayout", "RecyclerView", "LinearLayout", "GridView"],
      1,
      "LazyColumn lazily composes and layouts only visible items — the Compose equivalent of RecyclerView.",
    ),
    mcq(
      "andm1p3-9",
      "State hoisting in Compose means:",
      [
        "Moving state to a higher-level composable",
        "Storing state in a database",
        "Using static variables",
        "Global state only",
      ],
      0,
      "State hoisting lifts state to a common ancestor, making composables stateless and more reusable.",
    ),
    mcq(
      "andm1p3-10",
      "Text composable in Compose:",
      [
        "Handles user input",
        "Displays a string of text",
        "Creates a button",
        "Manages state",
      ],
      1,
      "Text() displays a string, similar to TextView in the traditional View system.",
    ),
    mcq(
      "andm1p3-11",
      "Button composable in Compose has:",
      [
        "No onClick parameter",
        "An onClick lambda and a content composable slot",
        "Only icon support",
        "XML drawable only",
      ],
      1,
      "Button takes onClick and content parameters: Button(onClick = { }) { Text('Click') }",
    ),
    mcq(
      "andm1p3-12",
      "MaterialTheme in Compose:",
      [
        "Only sets colors",
        "Provides Material Design tokens (colors, typography, shapes) to the UI",
        "Is optional",
        "Replaces the Activity",
      ],
      1,
      "MaterialTheme wraps your app and provides consistent Material Design styling throughout.",
    ),
    mcq(
      "andm1p3-13",
      "SideEffect in Compose is used for:",
      [
        "Creating new state",
        "Performing non-composable side effects (like updating non-Compose code)",
        "Database queries",
        "Navigation only",
      ],
      1,
      "Side effects (LaunchedEffect, SideEffect, DisposableEffect) handle operations outside composition.",
    ),
    mcq(
      "andm1p3-14",
      "Preview annotation in Compose:",
      [
        "Builds the app",
        "Renders a composable in Android Studio without running the app",
        "Tests the composable",
        "Optimizes performance",
      ],
      1,
      "@Preview renders composables in the Android Studio design editor for quick visual feedback.",
    ),
    mcq(
      "andm1p3-15",
      "ViewModel with Compose uses:",
      [
        "remember only",
        "viewModel() or hiltViewModel() to scope ViewModel to composition",
        "Static fields",
        "SharedPreferences",
      ],
      1,
      "viewModel() provides a ViewModel scoped to the composable's lifecycle — state survives recomposition.",
    ),
  ],
  programmingQuestions: [
    pq(
      "andm1p3-pq1",
      "Counter Composable",
      "Write a Kotlin Jetpack Compose @Composable function 'CounterScreen' that shows a Text with the current count and a Button labeled 'Increment'. Clicking the button increases the count by 1. Use remember and mutableStateOf.",
      [{ input: "(none)", output: "Compose Counter with state and button" }],
      `// Write a @Composable CounterScreen with:
// - A Text showing "Count: X"
// - A Button "Increment" that increases count
// Use remember { mutableStateOf(0) }
`,
      71,
      "Kotlin",
      [
        "Declare var count by remember { mutableStateOf(0) } inside the composable.",
        "Use Column { Text('Count: $count'); Button(onClick = { count++ }) { Text('Increment') } }",
        `@Composable\nfun CounterScreen() {\n    var count by remember { mutableStateOf(0) }\n    Column(horizontalAlignment = Alignment.CenterHorizontally) {\n        Text(text = "Count: ${"$"}count")\n        Button(onClick = { count++ }) {\n            Text("Increment")\n        }\n    }\n}`,
      ],
      [
        "@Composable",
        "remember",
        "mutableStateOf",
        "Column",
        "Text",
        "Button",
        "onClick",
      ],
    ),
    pq(
      "andm1p3-pq2",
      "List Composable",
      "Write a Kotlin Jetpack Compose function 'FruitList' that takes a List<String> and displays each fruit in a LazyColumn using Text composables.",
      [{ input: "(none)", output: "Compose LazyColumn displaying list items" }],
      `// Write a @Composable FruitList(fruits: List<String>)
// Use LazyColumn with items(fruits) { fruit -> Text(text = fruit) }
`,
      71,
      "Kotlin",
      [
        "Annotate with @Composable and accept fruits: List<String> as parameter.",
        "Use LazyColumn { items(fruits) { fruit -> Text(text = fruit) } }",
        "@Composable\nfun FruitList(fruits: List<String>) {\n    LazyColumn {\n        items(fruits) { fruit ->\n            Text(text = fruit, modifier = Modifier.padding(8.dp))\n        }\n    }\n}",
      ],
      [
        "@Composable",
        "LazyColumn",
        "items",
        "Text",
        "List<String>",
        "Modifier.padding",
      ],
    ),
  ],
};

// ─── ANDROID: Data & Networking ───────────────────────────────────────────────
const ANDROID_M1_P4: PartQuizData = {
  mcqs: [
    mcq(
      "andm1p4-1",
      "Room is an Android library for:",
      [
        "Network requests",
        "SQLite database abstraction",
        "UI components",
        "Background tasks",
      ],
      1,
      "Room provides an ORM-like abstraction over SQLite, with type-safe queries and compile-time verification.",
    ),
    mcq(
      "andm1p4-2",
      "A Room Entity represents:",
      [
        "A database query",
        "A table in the SQLite database",
        "A repository class",
        "A ViewModel",
      ],
      1,
      "Each @Entity-annotated class represents a database table in Room.",
    ),
    mcq(
      "andm1p4-3",
      "DAO in Room stands for:",
      [
        "Data Access Object — defines database query methods",
        "Data Android Object",
        "Direct Access Operation",
        "Database Abstraction Object",
      ],
      0,
      "DAO (Data Access Object) interface defines database operations with @Query, @Insert, @Delete annotations.",
    ),
    mcq(
      "andm1p4-4",
      "Retrofit is used for:",
      [
        "Local database access",
        "Making HTTP network requests to REST APIs",
        "Background processing",
        "UI animations",
      ],
      1,
      "Retrofit is a type-safe HTTP client for Android that turns REST APIs into Kotlin/Java interfaces.",
    ),
    mcq(
      "andm1p4-5",
      "OkHttp in Android:",
      [
        "Is a UI library",
        "Is the HTTP client underlying Retrofit",
        "Is a database driver",
        "Handles push notifications",
      ],
      1,
      "OkHttp is the HTTP client that Retrofit uses by default for network communication.",
    ),
    mcq(
      "andm1p4-6",
      "Coroutines in Android are used for:",
      [
        "UI layout",
        "Asynchronous operations without blocking the main thread",
        "Database schema definition",
        "XML parsing",
      ],
      1,
      "Kotlin Coroutines enable async/await-style code for network calls and database access.",
    ),
    mcq(
      "andm1p4-7",
      "LiveData in Android:",
      [
        "Is a network library",
        "Is an observable data holder lifecycle-aware",
        "Is a layout component",
        "Is a Room annotation",
      ],
      1,
      "LiveData observes data changes and updates the UI automatically, respecting Android lifecycle.",
    ),
    mcq(
      "andm1p4-8",
      "ViewModel in MVVM pattern:",
      [
        "Holds UI layout",
        "Holds and manages UI-related data, surviving configuration changes",
        "Is a database entity",
        "Makes network requests directly",
      ],
      1,
      "ViewModel survives screen rotations and holds UI data, separating it from the Activity/Fragment.",
    ),
    mcq(
      "andm1p4-9",
      "Flow in Kotlin is:",
      [
        "A layout component",
        "A cold asynchronous data stream",
        "A database type",
        "A service component",
      ],
      1,
      "Flow emits multiple values over time asynchronously — used with Room and Retrofit for reactive data.",
    ),
    mcq(
      "andm1p4-10",
      "To use the internet in Android, you need:",
      [
        "Nothing — it's automatic",
        "The INTERNET permission in AndroidManifest.xml",
        "A special Activity type",
        "Root access",
      ],
      1,
      "Apps must declare the INTERNET permission in AndroidManifest.xml to make network requests.",
    ),
    mcq(
      "andm1p4-11",
      "Gson/Moshi in Android are used for:",
      [
        "Database migration",
        "JSON serialization/deserialization",
        "Image loading",
        "UI theming",
      ],
      1,
      "Gson and Moshi convert JSON strings to/from Kotlin/Java data objects (serialization/deserialization).",
    ),
    mcq(
      "andm1p4-12",
      "The Repository pattern in Android:",
      [
        "Directly exposes database and network to UI",
        "Abstracts data sources (Room, Retrofit) from the ViewModel",
        "Is a UI component",
        "Is deprecated",
      ],
      1,
      "Repository centralizes data access logic, hiding whether data comes from Room, network, or cache.",
    ),
    mcq(
      "andm1p4-13",
      "SharedPreferences is best for:",
      [
        "Large datasets",
        "Small key-value pairs like user settings",
        "Binary files",
        "SQL queries",
      ],
      1,
      "SharedPreferences stores small primitive data (settings, login state) as persistent key-value pairs.",
    ),
    mcq(
      "andm1p4-14",
      "Coil and Glide are Android libraries for:",
      [
        "Database access",
        "Asynchronous image loading and caching",
        "Network requests",
        "Animations",
      ],
      1,
      "Coil and Glide handle image loading, caching, and displaying in ImageViews efficiently.",
    ),
    mcq(
      "andm1p4-15",
      "DataStore is the modern replacement for:",
      ["Room", "SharedPreferences", "Retrofit", "WorkManager"],
      1,
      "DataStore (Proto DataStore and Preferences DataStore) replaces SharedPreferences with coroutine-based async access.",
    ),
  ],
  programmingQuestions: [
    pq(
      "andm1p4-pq1",
      "Room Entity Definition",
      "Write a Kotlin Room @Entity data class 'User' with: table name 'users', primary key 'id' (auto-generate), 'name' (String), and 'email' (String) fields.",
      [{ input: "(none)", output: "Kotlin Room Entity data class" }],
      `// Write a Room @Entity data class for a 'users' table
// Fields: id (PrimaryKey, autoGenerate=true), name: String, email: String
`,
      71,
      "Kotlin",
      [
        "Annotate the class with @Entity(tableName = 'users').",
        "Use @PrimaryKey(autoGenerate = true) on the id: Int field.",
        `@Entity(tableName = "users")\ndata class User(\n    @PrimaryKey(autoGenerate = true) val id: Int = 0,\n    val name: String,\n    val email: String\n)`,
      ],
      [
        "@Entity",
        "tableName",
        "@PrimaryKey",
        "autoGenerate",
        "data class",
        "String",
      ],
    ),
    pq(
      "andm1p4-pq2",
      "Retrofit Interface",
      "Write a Kotlin Retrofit interface 'ApiService' with: a GET endpoint '/users' that returns a List<User> (suspend function), and a POST endpoint '/users' that accepts a User body and returns User.",
      [{ input: "(none)", output: "Kotlin Retrofit API interface" }],
      `// Write a Retrofit interface ApiService
// GET /users -> List<User> (suspend)
// POST /users with @Body User -> User (suspend)
`,
      71,
      "Kotlin",
      [
        "Annotate the interface methods with @GET('/users') and @POST('/users').",
        "Use suspend fun for coroutine support and @Body for the POST parameter.",
        `interface ApiService {\n    @GET("/users")\n    suspend fun getUsers(): List<User>\n\n    @POST("/users")\n    suspend fun createUser(@Body user: User): User\n}`,
      ],
      ["interface", "@GET", "@POST", "@Body", "suspend fun", "List<User>"],
    ),
  ],
};

// ─── ANDROID: Background Work ─────────────────────────────────────────────────
const ANDROID_M1_P5: PartQuizData = {
  mcqs: [
    mcq(
      "andm1p5-1",
      "WorkManager is used for:",
      [
        "UI updates",
        "Guaranteed background work that persists across app restarts",
        "Network requests only",
        "Foreground services only",
      ],
      1,
      "WorkManager guarantees deferred background tasks run even if the app is killed or device reboots.",
    ),
    mcq(
      "andm1p5-2",
      "A Worker class in WorkManager:",
      [
        "Renders UI",
        "Implements the background task logic in doWork()",
        "Makes HTTP calls directly",
        "Manages notifications UI",
      ],
      1,
      "Workers extend Worker and override doWork() to implement the background task logic.",
    ),
    mcq(
      "andm1p5-3",
      "WorkRequest in WorkManager can be:",
      [
        "Only immediate",
        "OneTimeWorkRequest or PeriodicWorkRequest",
        "Only periodic",
        "Only chained",
      ],
      1,
      "OneTimeWorkRequest runs once; PeriodicWorkRequest runs repeatedly at a specified interval.",
    ),
    mcq(
      "andm1p5-4",
      "doWork() in Worker should return:",
      [
        "null",
        "A Boolean",
        "Result.success(), Result.failure(), or Result.retry()",
        "void",
      ],
      2,
      "doWork() returns Result.success() on success, Result.failure() on permanent failure, Result.retry() for retry.",
    ),
    mcq(
      "andm1p5-5",
      "Notifications in Android are shown via:",
      [
        "Toast only",
        "NotificationManager with a NotificationCompat.Builder",
        "AlertDialog",
        "Snackbar only",
      ],
      1,
      "NotificationManager.notify() displays notifications built with NotificationCompat.Builder.",
    ),
    mcq(
      "andm1p5-6",
      "Notification Channels (Android 8+) are required for:",
      [
        "All apps below API 26",
        "Grouping notifications by importance and behavior",
        "Background location only",
        "SMS notifications only",
      ],
      1,
      "Android 8.0+ requires notifications to be assigned to a channel, each with its own sound/vibration settings.",
    ),
    mcq(
      "andm1p5-7",
      "A Foreground Service in Android:",
      [
        "Runs silently with no user awareness",
        "Shows a persistent notification while doing long-running work",
        "Is the same as WorkManager",
        "Only works on WiFi",
      ],
      1,
      "Foreground services run prominently with a visible notification — used for music playback, tracking, etc.",
    ),
    mcq(
      "andm1p5-8",
      "Constraints in WorkManager allow:",
      [
        "Custom animations",
        "Specifying conditions like network connectivity before work runs",
        "Only time-based triggers",
        "UI requirements",
      ],
      1,
      "WorkRequest.Builder supports constraints (requiresNetwork, requiresCharging, etc.) that must be met before execution.",
    ),
    mcq(
      "andm1p5-9",
      "WorkInfo.State.SUCCEEDED means:",
      [
        "Work failed",
        "Work is queued",
        "Work completed successfully",
        "Work is running",
      ],
      2,
      "SUCCEEDED is the terminal state indicating doWork() returned Result.success().",
    ),
    mcq(
      "andm1p5-10",
      "Coroutines for background work use:",
      [
        "Worker",
        "CoroutineWorker (extending CoroutineWorker)",
        "AsyncTask (deprecated)",
        "Thread.sleep()",
      ],
      1,
      "CoroutineWorker is WorkManager's coroutine-friendly Worker — doWork() is a suspend function.",
    ),
    mcq(
      "andm1p5-11",
      "AlarmManager is used for:",
      [
        "Exact alarms at specific times (Calendar, exact timers)",
        "Long deferred tasks",
        "UI animations",
        "Database queries",
      ],
      0,
      "AlarmManager fires intents at specific times — used for exact scheduled actions (deprecated for inexact by WorkManager).",
    ),
    mcq(
      "andm1p5-12",
      "POST_NOTIFICATIONS permission (Android 13+) is required for:",
      [
        "Background services",
        "Showing any notification to the user",
        "Foreground services only",
        "WorkManager only",
      ],
      1,
      "Android 13+ requires runtime POST_NOTIFICATIONS permission before showing any notifications.",
    ),
    mcq(
      "andm1p5-13",
      "Data class in WorkManager passes:",
      [
        "Database entities",
        "Key-value pairs of input/output data to/from Workers",
        "UI state",
        "Intent extras",
      ],
      1,
      "Data objects carry key-value pairs as input to Workers and output from them.",
    ),
    mcq(
      "andm1p5-14",
      "WorkContinuation enables:",
      [
        "Single tasks only",
        "Chaining multiple WorkRequests in sequence or parallel",
        "Only UI operations",
        "Database migration",
      ],
      1,
      "WorkContinuation chains work: then() for sequential, combine() for parallel work graphs.",
    ),
    mcq(
      "andm1p5-15",
      "BroadcastReceiver is used to:",
      [
        "Display UI",
        "Listen for system or app broadcast events",
        "Run background tasks continuously",
        "Store data",
      ],
      1,
      "BroadcastReceiver handles broadcast messages from the Android system or other apps.",
    ),
  ],
  programmingQuestions: [
    pq(
      "andm1p5-pq1",
      "WorkManager Worker Class",
      "Write a Kotlin Worker class 'UploadWorker' that extends Worker. The doWork() method should: get a String input with key 'upload_url' from inputData, log it with Log.d, and return Result.success().",
      [{ input: "(none)", output: "Kotlin Worker class with doWork()" }],
      `// Write a Kotlin Worker class UploadWorker
// doWork(): get 'upload_url' from inputData, Log.d it, return Result.success()
`,
      71,
      "Kotlin",
      [
        "Extend Worker(context: Context, workerParams: WorkerParameters).",
        "In doWork(), use inputData.getString('upload_url') and return Result.success().",
        `class UploadWorker(context: Context, workerParams: WorkerParameters) : Worker(context, workerParams) {\n    override fun doWork(): Result {\n        val url = inputData.getString("upload_url")\n        Log.d("UploadWorker", "Uploading to: ${"$"}url")\n        return Result.success()\n    }\n}`,
      ],
      [
        "Worker",
        "doWork",
        "inputData.getString",
        "Result.success",
        "Log.d",
        "override",
      ],
    ),
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const ML_DEVOPS_ANDROID_QUIZZES: Record<string, PartQuizData> = {
  // ML domain
  "ml-module1-part1": ML_M1_P1,
  "ml-module1-part2": ML_M1_P2,
  "ml-module1-part3": ML_M1_P3,
  "ml-module1-part4": ML_M1_P4,
  "ml-module1-part5": ML_M1_P5,
  // DevOps domain
  "devops-module1-part1": DEVOPS_M1_P1,
  "devops-module1-part2": DEVOPS_M1_P2,
  "devops-module1-part3": DEVOPS_M1_P3,
  "devops-module1-part4": DEVOPS_M1_P4,
  "devops-module1-part5": DEVOPS_M1_P5,
  // Android domain
  "android-module1-part1": ANDROID_M1_P1,
  "android-module1-part2": ANDROID_M1_P2,
  "android-module1-part3": ANDROID_M1_P3,
  "android-module1-part4": ANDROID_M1_P4,
  "android-module1-part5": ANDROID_M1_P5,
};
