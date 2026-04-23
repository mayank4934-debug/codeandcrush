import type {
  CModule,
  CQuizProgrammingQuestion,
  CQuizQuestion,
  CTestProblem,
} from "./cProgrammingCourse";

// ─── Module 0: Orientation ────────────────────────────────────────────────────

const java_module0: CModule = {
  id: "java-module0",
  title: "Module 0: Getting Started",
  outcome:
    "Understand the course structure, learning path, how modules unlock, how quizzes work, and what XP you earn",
  isLocked: false,
  parts: [
    {
      id: "java-module0-orientation",
      title: "Course Orientation",
      description:
        "Welcome to Java Development! Your companion will guide you through everything you need to know before you start.",
      videoUrl: "",
      hasCodingContent: false,
      notes: `WELCOME TO JAVA DEVELOPMENT!

Hey! I'm so excited to be your companion on this Java Development journey! ☕ Java is one of the most widely used programming languages in the world — it powers Android apps, enterprise backends, big data pipelines, and countless mission-critical systems. Once you know Java, doors open everywhere!

COURSE OVERVIEW
Java is a strongly-typed, object-oriented language known for its "write once, run anywhere" philosophy. This course takes you from Java syntax and OOP fundamentals all the way through the Collections framework, multithreading and concurrency, file I/O, Spring Boot for backend development, and real-world project work. Java is the language of choice for backend engineering at most large enterprises and is a top interview language.

HOW THIS COURSE WORKS
This course has 5 modules, each unlocking after you complete the previous one. Each module has several Parts. Every Part contains: a Video (watch to learn), a Lesson (read for deeper understanding), a Documentation link (open in-app for reference), a Quiz (15 MCQs to test your knowledge), and Coding Questions (in parts where you write Java code). After all parts, there's a Module Test. Complete the test to unlock the next module!

HOW YOU EARN
• 5 XP per correct MCQ answer in quizzes
• 20 XP per completed coding question
• Badges for completing each module
• SP (Study Points) for in-app purchases
• GCoins for daily challenges and streaks

ESTIMATED COMPLETION TIME: ~35 hours
This is a structured Java course. Dedicate 1–2 hours per day and you'll be building Spring Boot applications in about 4 weeks.

WHAT TO DO NEXT
Complete the Getting Started checklist below, then scroll down to Module 1 to begin! 🚀`,
      docs: [],
      partQuiz: [],
      partProgrammingQuestions: [] as CQuizProgrammingQuestion[],
      subsections: [
        {
          id: "java-module0-learning-path",
          title: "Your Learning Path",
          content: `Here's the complete roadmap for this Java Development course:

1. Java Basics — JVM, JDK, syntax, variables, data types, operators, control flow
2. OOP — Classes, objects, inheritance, polymorphism, encapsulation, abstraction, interfaces
3. Collections — ArrayList, LinkedList, HashMap, HashSet, Generics, Iterators
4. Multithreading — Threads, Runnable, synchronization, locks, ExecutorService, CompletableFuture
5. File I/O — Streams, Readers/Writers, NIO, serialization, exception handling
6. Spring Boot — REST controllers, JPA/Hibernate, Spring Security, dependency injection
7. Projects — Build a complete REST API with Spring Boot, MySQL, and JWT authentication`,
          codeExample: "",
        },
        {
          id: "java-module0-module-structure",
          title: "How Modules Work",
          content: `Each module in this course is broken into Parts. Here's how a typical Part is structured:

• Video — A curated video explaining the concept visually
• Lesson — In-depth readable content you can study at your own pace
• Documentation — In-app reference material for that topic
• Quiz — 15 multiple-choice questions (5 XP each) to reinforce learning
• Coding Questions — Java programming exercises in coding parts

Theory-only parts do NOT have coding questions. Only parts where you write actual Java code include programming exercises.

Module Unlock Rules:
• Module 1 is always unlocked and ready to start
• Each subsequent module unlocks after you pass the previous module's test
• You can retake quizzes to improve your score`,
          codeExample: "",
        },
        {
          id: "java-module0-checklist",
          title: "Getting Started Checklist",
          content: `Complete these steps before heading to Module 1:

1. Read the course overview above — understand what Java development is and why it matters
2. Meet your study companion — they'll guide you through every lesson with hints and encouragement
3. Understand how modules unlock — complete one module's test to access the next
4. Know how quizzes work — 15 MCQs per part, plus coding questions in coding topics
5. Check your XP progress bar in the sidebar — it grows as you complete lessons and quizzes
6. You're all set! Head to Module 1 below to begin your Java Development journey 🎉`,
          codeExample: "",
        },
      ],
    },
  ],
  moduleQuiz: [],
  moduleTest: [],
};

// ─── Module 1: Java Basics ────────────────────────────────────────────────────

const java_module1: CModule = {
  id: "java-basics",
  title: "Module 1: Java Basics",
  outcome:
    "Write Java programs using core syntax, data types, control flow, and methods.",
  isLocked: false,
  parts: [
    {
      id: "java-m1-p1",
      title: "Part 1: Java Setup & Syntax",
      description:
        "Installing JDK, compiling and running Java programs, variables, and basic syntax.",
      hasCodingContent: true,
      videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
      notes: `JAVA SETUP & SYNTAX

Java programs are compiled to bytecode (.class files) by the Java Compiler (javac) and run on the Java Virtual Machine (JVM). Install the JDK (Java Development Kit) — not just the JRE — to compile code.

Every Java program starts execution in the main method:
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

Key rules:
• File name must match the public class name
• Statements end with semicolons
• Java is case-sensitive
• Curly braces define code blocks

Data Types:
• int (32-bit integer), long (64-bit), double (floating point), boolean, char, String
• Variables must be declared with a type: int x = 5;
• String is a class, not a primitive — String name = "Alice";`,
      docs: [],
      partQuiz: [
        {
          question: "What is the JVM?",
          options: [
            "Java Virtual Machine — runs Java bytecode",
            "Java Variable Manager",
            "Just-in-time Version Manager",
            "Java Validation Module",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question: "What command compiles a Java file?",
          options: [
            "java Hello.java",
            "javac Hello.java",
            "compile Hello",
            "jdk Hello.java",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "What is the entry point of a Java program?",
          options: ["start()", "init()", "main(String[] args)", "run()"],
          correct: 2,
          xp: 10,
        },
        {
          question: "How do you print to the console in Java?",
          options: [
            "print('Hello')",
            "console.log('Hello')",
            "System.out.println('Hello')",
            "printf('Hello')",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "Which data type stores a whole number in Java?",
          options: ["float", "double", "int", "char"],
          correct: 2,
          xp: 10,
        },
        {
          question: "Java files must have the same name as the:",
          options: ["main method", "public class", "package", "import"],
          correct: 1,
          xp: 10,
        },
        {
          question: "What does 'static' mean in the main method signature?",
          options: [
            "The method can only be called once",
            "The method belongs to the class, not an instance",
            "The method cannot be overridden",
            "The method returns nothing",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "How do you declare a constant in Java?",
          options: [
            "const int X = 5;",
            "final int X = 5;",
            "static int X = 5;",
            "readonly int X = 5;",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which of these is a valid Java variable name?",
          options: ["2name", "my-var", "myVar", "class"],
          correct: 2,
          xp: 10,
        },
        {
          question: "What is the size of an int in Java?",
          options: ["16 bits", "32 bits", "64 bits", "8 bits"],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which keyword exits a loop immediately?",
          options: ["exit", "stop", "break", "return"],
          correct: 2,
          xp: 10,
        },
        {
          question: "How do you start a single-line comment in Java?",
          options: ["#", "--", "//", "/*"],
          correct: 2,
          xp: 10,
        },
        {
          question: "What is the default value of an uninitialized int field?",
          options: ["null", "undefined", "0", "-1"],
          correct: 2,
          xp: 10,
        },
        {
          question: "String in Java is:",
          options: [
            "A primitive type",
            "A class (object)",
            "A keyword",
            "An interface",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which operator checks value AND type equality in Java?",
          options: ["=", "==", "equals()", "==="],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "java-m1-p1-pq1",
          question: "Hello World with Name",
          description:
            "Write a Java program that prints 'Hello, Java Developer!' to the console using System.out.println.",
          starterCode: `public class HelloJava {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
          expectedOutput: "Hello, Java Developer!",
          hint: 'Use System.out.println("Hello, Java Developer!"); inside the main method.',
          xp: 20,
        },
        {
          id: "java-m1-p1-pq2",
          question: "Variable Arithmetic",
          description:
            "Declare two int variables a = 15 and b = 7. Print their sum, difference, product, and remainder (modulo) each on a new line.",
          starterCode: `public class Arithmetic {
    public static void main(String[] args) {
        int a = 15;
        int b = 7;
        // Print sum, difference, product, and remainder
    }
}`,
          expectedOutput: "22\n8\n105\n1",
          hint: "Use + for sum, - for difference, * for product, % for remainder.",
          xp: 20,
        },
      ] as CQuizProgrammingQuestion[],
      subsections: [
        {
          id: "java-m1-p1-s1",
          title: "Installing the JDK",
          content: `Java Development Kit (JDK) includes the compiler (javac), the JVM, and standard libraries. Download the latest LTS version from oracle.com or use OpenJDK (adoptium.net). Verify installation by running 'java -version' and 'javac -version' in the terminal.`,
          codeExample: `// Compile: javac Hello.java
// Run: java Hello
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        },
        {
          id: "java-m1-p1-s2",
          title: "Variables & Data Types",
          content:
            "Java is strongly and statically typed \u2014 every variable must be declared with a type. Primitives store values directly; reference types (like String) store addresses. Use final to declare constants.",
          codeExample: `int age = 25;
double price = 9.99;
boolean isActive = true;
char grade = 'A';
String name = "Alice";
final int MAX = 100; // constant`,
        },
        {
          id: "java-m1-p1-s3",
          title: "Reading User Input",
          content:
            "Use Scanner to read input from the console. Import java.util.Scanner, create a new Scanner(System.in), then call nextInt(), nextDouble(), or nextLine() to read values.",
          codeExample: `import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        System.out.println("Hello, " + name);
        sc.close();
    }
}`,
        },
      ],
    },
  ],
  moduleQuiz: [] as CQuizQuestion[],
  moduleTest: [] as CTestProblem[],
};

// ─── Module 2: OOP in Java ────────────────────────────────────────────────────

const java_module2: CModule = {
  id: "java-oop",
  title: "Module 2: Object-Oriented Programming",
  outcome:
    "Design and implement Java programs using classes, inheritance, interfaces, and polymorphism.",
  isLocked: true,
  parts: [
    {
      id: "java-m2-p1",
      title: "Part 1: Classes & Objects",
      description:
        "Defining classes, creating objects, constructors, and encapsulation.",
      hasCodingContent: true,
      videoUrl: "https://www.youtube.com/watch?v=pTB0EiLXUC8",
      notes: `CLASSES & OBJECTS

A class is a blueprint; an object is an instance. Use 'new' to create objects. Constructors initialize fields. Getters and setters enforce encapsulation.

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
}

Person p = new Person("Alice", 30);
System.out.println(p.getName()); // Alice`,
      docs: [],
      partQuiz: [
        {
          question: "What keyword creates a new object?",
          options: ["create", "new", "make", "instantiate"],
          correct: 1,
          xp: 10,
        },
        {
          question: "What is a constructor?",
          options: [
            "A method that destroys objects",
            "A special method that initializes an object",
            "A static method",
            "An interface method",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Encapsulation means:",
          options: [
            "Inheriting from a parent class",
            "Hiding internal state and exposing only needed interface",
            "Overriding methods",
            "Using interfaces",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "The 'private' keyword:",
          options: [
            "Makes a member accessible everywhere",
            "Makes a member accessible only within its class",
            "Prevents inheritance",
            "Makes a method abstract",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which keyword refers to the current object?",
          options: ["self", "this", "current", "me"],
          correct: 1,
          xp: 10,
        },
        {
          question: "A default constructor has:",
          options: [
            "No parameters",
            "One parameter",
            "Return type void",
            "Static keyword",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question: "Getter methods are also called:",
          options: ["Mutators", "Accessors", "Constructors", "Destructors"],
          correct: 1,
          xp: 10,
        },
        {
          question: "What does 'public' access modifier mean?",
          options: [
            "Only same package",
            "Only subclasses",
            "Accessible from anywhere",
            "Only same class",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "Method overloading means:",
          options: [
            "Same name, different parameters",
            "Same name, same parameters in subclass",
            "Hiding a parent method",
            "Implementing an interface",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question: "Static members belong to:",
          options: [
            "Each object instance",
            "The class itself",
            "Subclasses only",
            "Interfaces",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which is NOT a Java access modifier?",
          options: ["public", "private", "protected", "internal"],
          correct: 3,
          xp: 10,
        },
        {
          question: "An abstract class:",
          options: [
            "Cannot have any methods",
            "Can be instantiated directly",
            "Cannot be instantiated directly and may have abstract methods",
            "Must implement all interface methods",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "Java supports multiple inheritance via:",
          options: [
            "extends keyword with multiple classes",
            "implements keyword for interfaces",
            "abstract classes",
            "final keyword",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "super() in a constructor calls:",
          options: [
            "The current class constructor",
            "The parent class constructor",
            "An interface method",
            "A static method",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "@Override annotation indicates:",
          options: [
            "The method is new",
            "The method overrides a parent method",
            "The method is deprecated",
            "The method is abstract",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "java-m2-p1-pq1",
          question: "Design a BankAccount Class",
          description:
            "Create a class BankAccount with private fields 'owner' (String) and 'balance' (double). Add a constructor, a deposit(double amount) method that adds to balance, and a getBalance() method. In main(), create an account for 'Alice' with 0.0 balance, deposit 500.0, then print the balance.",
          starterCode: `public class BankAccount {
    // Add private fields

    // Add constructor

    // Add deposit method

    // Add getBalance method

    public static void main(String[] args) {
        // Create account, deposit 500, print balance
    }
}`,
          expectedOutput: "500.0",
          hint: "Use 'this.owner = owner' in the constructor. In deposit(), do 'balance += amount'. Call System.out.println(account.getBalance()).",
          xp: 20,
        },
        {
          id: "java-m2-p1-pq2",
          question: "Constructor Overloading",
          description:
            "Create a class Rectangle with width and height fields. Provide two constructors: one that takes both width and height, and a default constructor that sets both to 1. Add an area() method. In main, print the area of a 4x6 rectangle and the area of a default rectangle.",
          starterCode: `public class Rectangle {
    // Add fields

    // Default constructor (width=1, height=1)

    // Parameterized constructor

    // area() method

    public static void main(String[] args) {
        // Create 4x6 rectangle, print area
        // Create default rectangle, print area
    }
}`,
          expectedOutput: "24\n1",
          hint: "In the default constructor: this(1, 1) or set this.width = 1 and this.height = 1. area() returns width * height.",
          xp: 20,
        },
      ] as CQuizProgrammingQuestion[],
      subsections: [
        {
          id: "java-m2-p1-s1",
          title: "Defining Classes",
          content: `A class defines the structure (fields) and behavior (methods) of objects. Access modifiers control visibility. Use 'this' to refer to the current instance.`,
          codeExample: `public class Car {
    private String brand;
    private int year;

    public Car(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }

    public String getBrand() { return brand; }
    public int getYear() { return year; }

    @Override
    public String toString() {
        return brand + " (" + year + ")";
    }
}`,
        },
        {
          id: "java-m2-p1-s2",
          title: "Inheritance",
          content: `Use 'extends' to inherit from a parent class. Subclasses inherit all public/protected fields and methods. Use 'super' to call the parent constructor or methods.`,
          codeExample: `public class ElectricCar extends Car {
    private int range;

    public ElectricCar(String brand, int year, int range) {
        super(brand, year);
        this.range = range;
    }

    public int getRange() { return range; }
}`,
        },
        {
          id: "java-m2-p1-s3",
          title: "Interfaces",
          content: `Interfaces define contracts (method signatures) without implementation. A class can implement multiple interfaces. Use 'default' methods to add implementation to interfaces.`,
          codeExample: `interface Drawable {
    void draw(); // abstract method
    default String getColor() { return "black"; } // default method
}

class Circle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}`,
        },
      ],
    },
  ],
  moduleQuiz: [] as CQuizQuestion[],
  moduleTest: [] as CTestProblem[],
};

// ─── Module 3: Collections & Generics ────────────────────────────────────────

const java_module3: CModule = {
  id: "java-collections",
  title: "Module 3: Collections & Generics",
  outcome:
    "Use Java Collections framework and generics to write flexible, type-safe data structures.",
  isLocked: true,
  parts: [
    {
      id: "java-m3-p1",
      title: "Part 1: Lists & Maps",
      description:
        "ArrayList, LinkedList, HashMap, HashSet and their time complexities.",
      hasCodingContent: true,
      videoUrl: "https://www.youtube.com/watch?v=dzFoq2qxp_I",
      notes: `JAVA COLLECTIONS

The Collections Framework provides ready-made data structures. Key interfaces:
• List — ordered, allows duplicates (ArrayList, LinkedList)
• Set — no duplicates (HashSet, TreeSet)
• Map — key-value pairs (HashMap, TreeMap)

ArrayList<String> list = new ArrayList<>();
list.add("Alice");
list.add("Bob");
list.get(0); // "Alice"

HashMap<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.get("Alice"); // 95

Generics enforce type safety at compile time:
List<Integer> nums = new ArrayList<>(); // only Integers allowed`,
      docs: [],
      partQuiz: [
        {
          question: "ArrayList is backed by:",
          options: ["A linked list", "An array", "A tree", "A hash table"],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which collection does NOT allow duplicates?",
          options: ["ArrayList", "LinkedList", "HashSet", "ArrayDeque"],
          correct: 2,
          xp: 10,
        },
        {
          question: "HashMap key lookup is:",
          options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"],
          correct: 2,
          xp: 10,
        },
        {
          question: "What does List.get(i) return?",
          options: [
            "The element at index i",
            "The first element",
            "The last element",
            "A sublist",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question: "TreeMap stores keys in:",
          options: [
            "Insertion order",
            "Sorted (natural) order",
            "Random order",
            "Hash order",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Generics in Java provide:",
          options: [
            "Runtime type checking",
            "Compile-time type safety",
            "Faster execution",
            "Memory management",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which method removes all elements from a collection?",
          options: ["delete()", "removeAll()", "clear()", "empty()"],
          correct: 2,
          xp: 10,
        },
        {
          question: "LinkedList is efficient for:",
          options: [
            "Random access by index",
            "Insertions/deletions at ends",
            "Sorting",
            "Searching by key",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Collections.sort() requires elements to implement:",
          options: ["Cloneable", "Serializable", "Comparable", "Iterable"],
          correct: 2,
          xp: 10,
        },
        {
          question: "What is an Iterator?",
          options: [
            "A type of loop",
            "An object to traverse a collection",
            "A sorting algorithm",
            "A generic type",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "List.size() returns:",
          options: [
            "Max capacity",
            "Number of elements",
            "Index of last element",
            "Memory used",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "HashMap.entrySet() returns:",
          options: [
            "All keys",
            "All values",
            "All key-value pairs as Set<Map.Entry>",
            "A sorted map",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "Which is the thread-safe equivalent of ArrayList?",
          options: [
            "HashSet",
            "LinkedList",
            "Vector or CopyOnWriteArrayList",
            "ArrayDeque",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "Stack follows which principle?",
          options: ["FIFO", "LIFO", "Priority order", "Sorted order"],
          correct: 1,
          xp: 10,
        },
        {
          question: "The diamond operator <> allows:",
          options: [
            "Empty generic type declaration",
            "Type inference for generics",
            "Multiple type parameters",
            "Raw types",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "java-m3-p1-pq1",
          question: "Word Frequency Counter",
          description:
            'Given the array String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"}, use a HashMap<String, Integer> to count how many times each word appears. Print each word and its count in the format \'word: count\', iterating over the entry set.',
          starterCode: `import java.util.*;

public class WordFrequency {
    public static void main(String[] args) {
        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};
        // Count frequencies using HashMap
        // Print each word: count
    }
}`,
          expectedOutput: "apple: 3\nbanana: 2\ncherry: 1",
          hint: 'Use map.getOrDefault(word, 0) + 1 to increment. Iterate with map.entrySet() and print e.getKey() + ": " + e.getValue().',
          xp: 20,
        },
        {
          id: "java-m3-p1-pq2",
          question: "Remove Duplicates with HashSet",
          description:
            "Given List<Integer> nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6, 5, 3), use a HashSet to get unique values, put them back into a sorted ArrayList, and print them separated by commas.",
          starterCode: `import java.util.*;

public class RemoveDuplicates {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6, 5, 3);
        // Remove duplicates using HashSet
        // Sort and print comma-separated
    }
}`,
          expectedOutput: "1, 2, 3, 4, 5, 6, 9",
          hint: 'new HashSet<>(nums) removes duplicates. new ArrayList<>(set) converts back. Collections.sort(list) sorts it. Use String.join(", ", ...) or a loop to print.',
          xp: 20,
        },
      ] as CQuizProgrammingQuestion[],
      subsections: [
        {
          id: "java-m3-p1-s1",
          title: "ArrayList vs LinkedList",
          content:
            "ArrayList uses a dynamic array \u2014 O(1) random access, O(n) insertions in middle. LinkedList uses doubly-linked nodes \u2014 O(1) insertions at head/tail, O(n) random access. Use ArrayList for most cases; LinkedList when you have frequent insertions/deletions at ends.",
          codeExample: `List<String> arrayList = new ArrayList<>();
arrayList.add("A");
arrayList.add("B");
System.out.println(arrayList.get(0)); // A

List<String> linkedList = new LinkedList<>();
linkedList.add("X");
((LinkedList<String>) linkedList).addFirst("Y"); // efficient`,
        },
        {
          id: "java-m3-p1-s2",
          title: "HashMap & HashSet",
          content:
            "HashMap stores key-value pairs with O(1) average get/put. HashSet is backed by a HashMap and stores unique elements. Iterating a HashMap uses entrySet() for key-value pairs.",
          codeExample: `Map<String, Integer> map = new HashMap<>();
map.put("one", 1);
map.put("two", 2);

for (Map.Entry<String, Integer> e : map.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}

Set<String> set = new HashSet<>(Arrays.asList("a", "b", "a"));
System.out.println(set.size()); // 2 (no duplicates)`,
        },
        {
          id: "java-m3-p1-s3",
          title: "Generics",
          content:
            "Generics let you write type-safe, reusable code. The type parameter T is replaced at compile time. Wildcards (?) allow flexible method signatures.",
          codeExample: `// Generic class
class Pair<A, B> {
    A first; B second;
    Pair(A first, B second) { this.first = first; this.second = second; }
}

Pair<String, Integer> p = new Pair<>("age", 25);
System.out.println(p.first + ": " + p.second);`,
        },
      ],
    },
  ],
  moduleQuiz: [] as CQuizQuestion[],
  moduleTest: [] as CTestProblem[],
};

// ─── Module 4: Multithreading & I/O ──────────────────────────────────────────

const java_module4: CModule = {
  id: "java-threads-io",
  title: "Module 4: Multithreading & File I/O",
  outcome:
    "Write concurrent Java programs using threads and handle files with I/O streams.",
  isLocked: true,
  parts: [
    {
      id: "java-m4-p1",
      title: "Part 1: Threads & Concurrency",
      description:
        "Creating threads, synchronization, locks, and the ExecutorService.",
      hasCodingContent: true,
      videoUrl: "https://www.youtube.com/watch?v=r_MbozD32eo",
      notes: `THREADS & CONCURRENCY

Java supports multithreading natively. Create threads by extending Thread or implementing Runnable.

// Using Runnable (preferred)
Runnable task = () -> System.out.println("Running in thread: " + Thread.currentThread().getName());
Thread t = new Thread(task);
t.start();

// Using ExecutorService (production preferred)
ExecutorService exec = Executors.newFixedThreadPool(4);
exec.submit(() -> processData());
exec.shutdown();

Synchronization prevents race conditions:
synchronized (lock) { sharedCounter++; }

Or use atomic classes:
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();`,
      docs: [],
      partQuiz: [
        {
          question: "Which method starts a thread?",
          options: ["run()", "execute()", "start()", "begin()"],
          correct: 2,
          xp: 10,
        },
        {
          question: "Runnable vs Thread: Runnable is preferred because:",
          options: [
            "It's faster",
            "Java only supports single inheritance; using Runnable allows extending other classes",
            "It auto-starts",
            "It handles exceptions",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "A race condition occurs when:",
          options: [
            "A thread waits too long",
            "Multiple threads access shared data without proper synchronization",
            "A thread throws an exception",
            "A thread is not started",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which class provides a thread pool?",
          options: [
            "ThreadGroup",
            "ExecutorService",
            "Runnable",
            "ThreadLocal",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "volatile keyword ensures:",
          options: [
            "Thread safety for all operations",
            "A variable is always read from main memory",
            "A method is synchronized",
            "A field is immutable",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Deadlock occurs when:",
          options: [
            "A thread runs forever",
            "Two threads wait for each other's locks",
            "A thread is interrupted",
            "An exception is thrown",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "AtomicInteger is used for:",
          options: [
            "Thread-safe integer operations without locking",
            "Creating thread pools",
            "Scheduling tasks",
            "File locking",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question: "Thread.sleep(1000) pauses for:",
          options: ["1 second", "100ms", "1 minute", "1 nanosecond"],
          correct: 0,
          xp: 10,
        },
        {
          question: "CompletableFuture is used for:",
          options: [
            "Synchronous operations",
            "Asynchronous programming with callbacks",
            "Thread pools",
            "File reading",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which method waits for a Future's result?",
          options: ["start()", "run()", "get()", "await()"],
          correct: 2,
          xp: 10,
        },
        {
          question: "ConcurrentHashMap is:",
          options: [
            "Slower than HashMap",
            "Thread-safe HashMap alternative",
            "Same as Hashtable",
            "An unordered set",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "wait() and notify() must be called within:",
          options: [
            "A static method",
            "A synchronized block",
            "A thread's run()",
            "An interface",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Thread states include:",
          options: [
            "NEW, RUNNABLE, BLOCKED, WAITING, TERMINATED",
            "RUNNING, STOPPED, PAUSED",
            "STARTED, RUNNING, DONE",
            "ACTIVE, SLEEPING, DEAD",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question: "ReentrantLock advantage over synchronized:",
          options: [
            "Faster always",
            "Try-lock, fairness policy, multiple conditions",
            "No deadlocks",
            "No need to release",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Which returns a value from a thread?",
          options: ["Runnable", "Callable", "Thread subclass", "Executor"],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "java-m4-p1-pq1",
          question: "Runnable Counter with ExecutorService",
          description:
            "Create an AtomicInteger counter. Submit 5 Runnable tasks to a fixed thread pool of 3 threads. Each task should increment the counter by 10. After all tasks complete (call shutdown() and awaitTermination), print the final counter value.",
          starterCode: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class ThreadCounter {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger counter = new AtomicInteger(0);
        // Create fixed thread pool of 3
        // Submit 5 tasks, each incrementing counter by 10
        // Shutdown and await termination
        // Print counter value
    }
}`,
          expectedOutput: "50",
          hint: "ExecutorService exec = Executors.newFixedThreadPool(3). Submit with exec.submit(() -> counter.addAndGet(10)). Call exec.shutdown() then exec.awaitTermination(5, TimeUnit.SECONDS).",
          xp: 20,
        },
        {
          id: "java-m4-p1-pq2",
          question: "Read Lines from a String (File I/O simulation)",
          description:
            "Use BufferedReader with a StringReader to read the multi-line string \"Line 1\\nLine 2\\nLine 3\" line by line. Print each line prefixed with its 1-based line number: '1: Line 1', '2: Line 2', '3: Line 3'.",
          starterCode: `import java.io.*;

public class LineReader {
    public static void main(String[] args) throws IOException {
        String data = "Line 1\nLine 2\nLine 3";
        // Use BufferedReader + StringReader to read line by line
        // Print each line with its line number prefix
    }
}`,
          expectedOutput: "1: Line 1\n2: Line 2\n3: Line 3",
          hint: 'new BufferedReader(new StringReader(data)). Use a counter variable. While (line = reader.readLine()) != null, increment counter and print counter + ": " + line.',
          xp: 20,
        },
      ] as CQuizProgrammingQuestion[],
      subsections: [
        {
          id: "java-m4-p1-s1",
          title: "Creating Threads",
          content:
            "Two main ways: extend Thread (limits inheritance) or implement Runnable (preferred). Lambdas make Runnable concise. Use Thread.currentThread().getName() to identify threads.",
          codeExample: `// Lambda Runnable
Thread t = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        System.out.println(Thread.currentThread().getName() + ": " + i);
    }
}, "Worker-1");
t.start();
t.join(); // wait for completion`,
        },
        {
          id: "java-m4-p1-s2",
          title: "Synchronization",
          content:
            "Use synchronized to prevent race conditions on shared resources. Synchronized can be applied to methods or blocks. The lock object is the monitor.",
          codeExample: `class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}`,
        },
        {
          id: "java-m4-p1-s3",
          title: "File I/O",
          content:
            "Use BufferedReader/BufferedWriter for text files (efficient). Use FileInputStream/FileOutputStream for binary. Try-with-resources auto-closes streams.",
          codeExample: `// Reading a file
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// Writing a file
try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
    writer.write("Hello, File!");
}`,
        },
      ],
    },
  ],
  moduleQuiz: [] as CQuizQuestion[],
  moduleTest: [] as CTestProblem[],
};

// ─── Module 5: Spring Boot ────────────────────────────────────────────────────

const java_module5: CModule = {
  id: "java-spring-boot",
  title: "Module 5: Spring Boot & Projects",
  outcome: "Build REST APIs with Spring Boot, JPA, and Spring Security.",
  isLocked: true,
  parts: [
    {
      id: "java-m5-p1",
      title: "Part 1: Spring Boot Basics",
      description:
        "Spring Boot project setup, REST controllers, dependency injection.",
      hasCodingContent: true,
      videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
      notes: `SPRING BOOT BASICS

Spring Boot removes boilerplate configuration for Spring apps. Create a project at start.spring.io.

@RestController marks a class as a REST API controller.
@GetMapping, @PostMapping, @PutMapping, @DeleteMapping map HTTP methods.
@RequestBody deserializes JSON to Java objects.
@PathVariable extracts values from the URL.

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAll() { return userService.findAll(); }

    @PostMapping
    public User create(@RequestBody User user) { return userService.save(user); }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) { return userService.findById(id); }
}

Spring IoC Container manages beans (objects). Use @Autowired or constructor injection to get dependencies.`,
      docs: [],
      partQuiz: [
        {
          question: "@RestController combines:",
          options: [
            "@Component + @RequestMapping",
            "@Controller + @ResponseBody",
            "@Service + @Repository",
            "@Bean + @Autowired",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "@GetMapping maps to:",
          options: ["HTTP POST", "HTTP PUT", "HTTP GET", "HTTP DELETE"],
          correct: 2,
          xp: 10,
        },
        {
          question: "Dependency injection in Spring means:",
          options: [
            "Manually creating objects",
            "Spring manages and provides object dependencies",
            "Importing libraries",
            "Using static methods",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "@Entity annotation marks:",
          options: [
            "A REST controller",
            "A Spring bean",
            "A JPA entity (database table)",
            "A configuration class",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "application.properties is used to:",
          options: [
            "Write Java code",
            "Configure Spring Boot properties",
            "Define REST endpoints",
            "Store test data",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "@RequestBody reads:",
          options: [
            "URL path variables",
            "Query parameters",
            "Request body JSON as Java object",
            "Response headers",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "JPA (Jakarta Persistence API) is used for:",
          options: [
            "REST API design",
            "Mapping Java objects to database tables",
            "Security configuration",
            "Unit testing",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Spring Data JPA's findById() returns:",
          options: ["T", "Optional<T>", "List<T>", "Future<T>"],
          correct: 1,
          xp: 10,
        },
        {
          question: "@Service annotation marks:",
          options: [
            "A controller",
            "A business logic bean",
            "A database repository",
            "A configuration",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "HTTP status 201 means:",
          options: ["OK", "Not Found", "Created", "Unauthorized"],
          correct: 2,
          xp: 10,
        },
        {
          question: "Spring Security is used for:",
          options: [
            "Database connections",
            "Authentication and authorization",
            "Logging",
            "Caching",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "JWT stands for:",
          options: [
            "Java Web Toolkit",
            "JSON Web Token",
            "Java Wrapper Type",
            "JavaScript Worker Thread",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "@Transactional ensures:",
          options: [
            "Thread safety",
            "Database operations run in a transaction",
            "Lazy loading",
            "Auto-rollback on startup",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "ResponseEntity<T> allows:",
          options: [
            "Only body response",
            "Controlling HTTP status code + headers + body",
            "Only status code",
            "Streaming data",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "spring-boot-starter-web includes:",
          options: [
            "Only a web server",
            "Tomcat, Spring MVC, Jackson for JSON",
            "Just Jackson",
            "Spring Security",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "java-m5-p1-pq1",
          question: "Model a Spring Boot REST Response",
          description:
            "Create a plain Java class (POJO) named Product with fields: id (Long), name (String), price (Double). Add a constructor, getters, and override toString() to return 'Product{id=X, name=Y, price=Z}'. In main(), create a Product(1L, \"Laptop\", 999.99) and print it.",
          starterCode: `public class Product {
    // Add fields: id (Long), name (String), price (Double)

    // Add constructor

    // Add getters

    @Override
    public String toString() {
        // Return formatted string
        return "";
    }

    public static void main(String[] args) {
        // Create and print a Product
    }
}`,
          expectedOutput: "Product{id=1, name=Laptop, price=999.99}",
          hint: 'In toString(), return "Product{id=" + id + ", name=" + name + ", price=" + price + "}". Create with new Product(1L, "Laptop", 999.99).',
          xp: 20,
        },
        {
          id: "java-m5-p1-pq2",
          question: "Simple In-Memory Repository",
          description:
            "Create a UserRepository class that stores User objects (each with id and name) in an ArrayList. Implement: add(User user), findById(int id) returning the user or null, and getAll() returning the list. In main(), add 3 users, find user with id=2 and print their name.",
          starterCode: `import java.util.*;

class User {
    int id;
    String name;
    User(int id, String name) { this.id = id; this.name = name; }
}

class UserRepository {
    // Use ArrayList to store users

    // add(User user)

    // findById(int id)

    // getAll()
}

public class RepositoryDemo {
    public static void main(String[] args) {
        UserRepository repo = new UserRepository();
        // Add users: Alice(1), Bob(2), Charlie(3)
        // Find id=2, print name
    }
}`,
          expectedOutput: "Bob",
          hint: "In findById, loop through the list: if (u.id == id) return u; return null at end. After finding user by id=2, print user.name.",
          xp: 20,
        },
      ] as CQuizProgrammingQuestion[],
      subsections: [
        {
          id: "java-m5-p1-s1",
          title: "Creating a Spring Boot Project",
          content:
            "Use Spring Initializr (start.spring.io) to generate a project with your chosen dependencies. Essential starters: spring-boot-starter-web (REST), spring-boot-starter-data-jpa (ORM), spring-boot-starter-security (auth). The @SpringBootApplication annotation bootstraps the whole application.",
          codeExample: `@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`,
        },
        {
          id: "java-m5-p1-s2",
          title: "JPA & Repositories",
          content:
            "Annotate your model class with @Entity and @Id. Extend JpaRepository<T, ID> to get CRUD methods for free \u2014 no SQL needed. Spring Data JPA also supports custom query methods by method name.",
          codeExample: `@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    // getters + setters
}

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}`,
        },
        {
          id: "java-m5-p1-s3",
          title: "Exception Handling",
          content:
            "Use @ControllerAdvice and @ExceptionHandler to handle exceptions globally. Return appropriate HTTP status codes \u2014 404 for not found, 400 for bad input, 500 for server errors.",
          codeExample: `@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("An error occurred: " + ex.getMessage());
    }
}`,
        },
      ],
    },
  ],
  moduleQuiz: [] as CQuizQuestion[],
  moduleTest: [] as CTestProblem[],
};

// ─── Additional Parts for Module 1: Java Basics ──────────────────────────────

java_module1.parts.push(
  {
    id: "java-m1-p2",
    title: "Part 2: Control Flow & Operators",
    description: "if/else, switch, for/while loops, break/continue, operators.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    notes: `CONTROL FLOW IN JAVA

Control flow determines the order your program executes statements.

if / else if / else:
int score = 85;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else {
    System.out.println("C");
}

switch (Java 14+ enhanced):
switch (day) {
    case "Mon", "Tue", "Wed", "Thu", "Fri" -> System.out.println("Weekday");
    case "Sat", "Sun" -> System.out.println("Weekend");
    default -> throw new IllegalArgumentException("Unknown day");
}

Loops:
• for (int i = 0; i < 10; i++) — classic counted loop
• while (condition) — unknown iteration count
• do { } while (condition) — runs at least once
• for (String s : list) — enhanced for-each`,
    docs: [],
    partQuiz: [
      {
        question: "Which loop always executes at least once?",
        options: ["for", "while", "do-while", "for-each"],
        correct: 2,
        xp: 10,
      },
      {
        question: "What does 'continue' do in a loop?",
        options: [
          "Exits the loop",
          "Skips to next iteration",
          "Breaks all loops",
          "Restarts the loop",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Enhanced for-each iterates over:",
        options: [
          "Only arrays",
          "Arrays and Iterable objects",
          "Maps only",
          "Strings only",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "What is the ternary operator?",
        options: [
          "a ? b : c — shorthand if/else",
          "a && b",
          "a || b",
          "a == b ? c",
        ],
        correct: 0,
        xp: 10,
      },
      {
        question: "Which operator checks logical AND?",
        options: ["|", "&", "&&", "||"],
        correct: 2,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m1-p2-s1",
        title: "if/else and switch",
        content:
          "Use if/else for conditions, switch for multiple discrete values. Java 14+ switch expressions return values directly.",
        codeExample: `int x = 5;
String result = switch (x) {
    case 1 -> "one";
    case 5 -> "five";
    default -> "other";
};
System.out.println(result); // five`,
      },
      {
        id: "java-m1-p2-s2",
        title: "Loops",
        content:
          "for loops count iterations; while loops check condition first; do-while guarantees at least one run; enhanced for-each iterates collections cleanly.",
        codeExample: `// Classic for
for (int i = 0; i < 5; i++) {
    System.out.print(i + " ");
}

// Enhanced for-each
String[] langs = {"Java", "Python", "JS"};
for (String lang : langs) {
    System.out.println(lang);
}`,
      },
    ],
  },
  {
    id: "java-m1-p3",
    title: "Part 3: Methods & Arrays",
    description: "Defining methods, parameters, return types, arrays, varargs.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    notes: `METHODS & ARRAYS

Methods encapsulate reusable logic. Every method has: access modifier, return type, name, parameters.

public static int add(int a, int b) {
    return a + b;
}

Arrays are fixed-size, indexed from 0:
int[] nums = {1, 2, 3, 4, 5};
int first = nums[0];           // 1
int len = nums.length;          // 5
Arrays.sort(nums);              // in-place sort

2D Arrays:
int[][] matrix = new int[3][4]; // 3 rows, 4 columns
matrix[0][0] = 1;

Varargs allow variable argument count:
public static int sum(int... nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}
sum(1, 2, 3, 4, 5); // 15`,
    docs: [],
    partQuiz: [
      {
        question: "What does 'void' return type mean?",
        options: [
          "Returns null",
          "Returns nothing",
          "Returns boolean",
          "Invalid method",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Array indices in Java start at:",
        options: ["1", "0", "-1", "Depends on type"],
        correct: 1,
        xp: 10,
      },
      {
        question: "What is varargs (...) used for?",
        options: [
          "Array access",
          "Variable-length argument lists",
          "Lambda syntax",
          "Generic type",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "How do you find the length of an array?",
        options: ["arr.size()", "arr.count", "arr.length", "length(arr)"],
        correct: 2,
        xp: 10,
      },
      {
        question: "Which method sorts an array in place?",
        options: [
          "Collections.sort()",
          "Arrays.sort()",
          "Array.order()",
          "arr.sort()",
        ],
        correct: 1,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m1-p3-s1",
        title: "Defining and Calling Methods",
        content:
          "Methods reduce code duplication. Parameters are passed by value (primitives) or by reference (objects). Return statement exits the method with a value.",
        codeExample: `public class MathUtils {
    public static double average(int[] nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        return (double) sum / nums.length;
    }

    public static void main(String[] args) {
        int[] data = {10, 20, 30, 40};
        System.out.println(average(data)); // 25.0
    }
}`,
      },
      {
        id: "java-m1-p3-s2",
        title: "Working with Arrays",
        content:
          "Declare with type[], initialize with new or literals. Use Arrays class for sorting, searching, and copying. 2D arrays are arrays of arrays.",
        codeExample: `import java.util.Arrays;

int[] arr = {5, 2, 8, 1, 9};
Arrays.sort(arr);
System.out.println(Arrays.toString(arr)); // [1, 2, 5, 8, 9]

int idx = Arrays.binarySearch(arr, 8); // 3

// 2D
int[][] grid = {{1,2,3},{4,5,6},{7,8,9}};
for (int[] row : grid) {
    System.out.println(Arrays.toString(row));
}`,
      },
    ],
  },
);

// ─── Additional Parts for Module 2: OOP ──────────────────────────────────────

java_module2.parts.push(
  {
    id: "java-m2-p2",
    title: "Part 2: Polymorphism & Abstract Classes",
    description: "Method overriding, abstract classes, polymorphic behavior.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=pTB0EiLXUC8",
    notes: `POLYMORPHISM

Polymorphism means "many forms" — the same method name behaves differently based on the object type.

Method Overriding: Subclass provides its own implementation of a parent method.
@Override annotation verifies you're actually overriding.

abstract class Shape {
    abstract double area(); // no body
    void describe() { System.out.println("Shape area: " + area()); }
}

class Circle extends Shape {
    double radius;
    Circle(double r) { this.radius = r; }
    @Override
    public double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    double width, height;
    @Override
    public double area() { return width * height; }
}

// Polymorphic usage:
Shape[] shapes = { new Circle(5), new Rectangle() };
for (Shape s : shapes) {
    s.describe(); // Calls the correct area() for each type
}`,
    docs: [],
    partQuiz: [
      {
        question: "Polymorphism in Java means:",
        options: [
          "Multiple classes",
          "One interface, many implementations",
          "Multiple inheritance",
          "Static binding",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "What is method overriding?",
        options: [
          "Two methods with same name, different params in same class",
          "Subclass redefines a parent method",
          "Using static methods",
          "Creating new methods",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Abstract classes:",
        options: [
          "Can be instantiated",
          "Cannot be instantiated, may have abstract methods",
          "Must have all abstract methods",
          "Extend interfaces",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "What does @Override do?",
        options: [
          "Creates a new method",
          "Tells compiler you're overriding a parent method",
          "Hides parent method",
          "Makes method final",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "instanceof keyword checks:",
        options: [
          "Object equality",
          "Object type at runtime",
          "Class size",
          "Method existence",
        ],
        correct: 1,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m2-p2-s1",
        title: "Abstract Classes and Methods",
        content:
          "Abstract classes define a template. Abstract methods have no body — subclasses must implement them. Abstract classes can have concrete methods too.",
        codeExample: `abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }

    abstract void makeSound(); // must override

    void sleep() { System.out.println(name + " is sleeping"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }

    @Override
    public void makeSound() { System.out.println(name + " says: Woof!"); }
}

Dog d = new Dog("Rex");
d.makeSound(); // Rex says: Woof!
d.sleep();     // Rex is sleeping`,
      },
      {
        id: "java-m2-p2-s2",
        title: "Polymorphic References",
        content:
          "A parent type variable can hold child objects. The correct method is called at runtime (dynamic dispatch). Use instanceof before casting.",
        codeExample: `Animal a = new Dog("Buddy"); // polymorphic reference
a.makeSound(); // calls Dog's makeSound at runtime

// Safe casting
if (a instanceof Dog dog) {
    dog.fetch(); // Java 16+ pattern matching instanceof
}

// Array of polymorphic types
Animal[] zoo = { new Dog("Rex"), new Cat("Mimi") };
for (Animal animal : zoo) {
    animal.makeSound(); // dispatches to correct subclass
}`,
      },
    ],
  },
  {
    id: "java-m2-p3",
    title: "Part 3: Interfaces & Functional Design",
    description:
      "Interfaces, multiple interface implementation, default methods, functional interfaces.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=pTB0EiLXUC8",
    notes: `INTERFACES IN JAVA

An interface defines a contract — a set of method signatures a class must implement.

interface Flyable {
    void fly();
    default String getMode() { return "flying"; }
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() { System.out.println("Duck flies!"); }
    public void swim() { System.out.println("Duck swims!"); }
}

Java 8+ interfaces can have:
• default methods — provide a default implementation
• static methods — utility methods on the interface
• Functional interfaces — exactly one abstract method, used with lambdas

@FunctionalInterface
interface Transformer<T> {
    T transform(T input);
}

Transformer<String> upper = s -> s.toUpperCase();
System.out.println(upper.transform("hello")); // HELLO`,
    docs: [],
    partQuiz: [
      {
        question: "A class can implement how many interfaces?",
        options: ["One", "Two", "Three", "Unlimited"],
        correct: 3,
        xp: 10,
      },
      {
        question: "What is a functional interface?",
        options: [
          "Interface with no methods",
          "Interface with exactly one abstract method",
          "Interface with only default methods",
          "Static interface",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "default methods in interfaces:",
        options: [
          "Must be overridden",
          "Provide optional implementations",
          "Are abstract",
          "Cannot be inherited",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "What annotation marks a functional interface?",
        options: [
          "@Interface",
          "@Lambda",
          "@FunctionalInterface",
          "@SingleMethod",
        ],
        correct: 2,
        xp: 10,
      },
      {
        question: "Interfaces vs abstract classes: interfaces cannot have:",
        options: [
          "Default methods",
          "Static methods",
          "Instance fields (state)",
          "Generic type params",
        ],
        correct: 2,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m2-p3-s1",
        title: "Defining and Implementing Interfaces",
        content:
          "Interface keyword creates a contract. implements connects a class to an interface. All interface methods are public and abstract by default (unless default/static).",
        codeExample: `interface Printable {
    void print();
    default void printTwice() {
        print();
        print();
    }
}

interface Saveable {
    void save(String path);
}

class Document implements Printable, Saveable {
    private String content;
    Document(String content) { this.content = content; }

    @Override
    public void print() { System.out.println(content); }

    @Override
    public void save(String path) {
        System.out.println("Saving to " + path);
    }
}`,
      },
      {
        id: "java-m2-p3-s2",
        title: "Functional Interfaces and Lambdas",
        content:
          "Lambda expressions implement functional interfaces inline. Common built-in functional interfaces: Runnable, Callable, Comparator, Predicate, Function, Supplier, Consumer.",
        codeExample: `import java.util.function.*;

// Predicate: T -> boolean
Predicate<String> isLong = s -> s.length() > 5;
System.out.println(isLong.test("Hello"));    // false
System.out.println(isLong.test("Hello World")); // true

// Function: T -> R
Function<Integer, String> toStr = n -> "Number: " + n;
System.out.println(toStr.apply(42)); // Number: 42

// Comparator with lambda
List<String> names = Arrays.asList("Charlie","Alice","Bob");
names.sort((a, b) -> a.compareTo(b));
System.out.println(names); // [Alice, Bob, Charlie]`,
      },
    ],
  },
);

// ─── Additional Parts for Module 3: Collections ──────────────────────────────

java_module3.parts.push(
  {
    id: "java-m3-p2",
    title: "Part 2: Sorting, Searching & Iterators",
    description: "Comparable, Comparator, binary search, Iterator pattern.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=dzFoq2qxp_I",
    notes: `SORTING & ITERATORS

Sorting with Comparable — natural ordering built into the class:
class Student implements Comparable<Student> {
    String name;
    int gpa;

    @Override
    public int compareTo(Student other) {
        return Double.compare(this.gpa, other.gpa); // ascending GPA
    }
}

Sorting with Comparator — external, flexible ordering:
students.sort(Comparator.comparing(s -> s.name));           // by name
students.sort(Comparator.comparingInt(Student::getGpa).reversed()); // reverse GPA

Iterator pattern:
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.startsWith("x")) it.remove(); // safe removal during iteration
}

ListIterator allows backward iteration:
ListIterator<String> li = list.listIterator(list.size());
while (li.hasPrevious()) {
    System.out.println(li.previous());
}`,
    docs: [],
    partQuiz: [
      {
        question: "What does Comparable define?",
        options: [
          "External sort order",
          "Natural (built-in) ordering",
          "Comparator logic",
          "Hash code",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Comparator.comparing() takes:",
        options: [
          "A value",
          "A key extractor function",
          "A sort order",
          "A predicate",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Why use Iterator.remove() instead of list.remove()?",
        options: [
          "Faster",
          "Safe removal during iteration (avoids ConcurrentModificationException)",
          "Removes all occurrences",
          "Works on arrays",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Collections.binarySearch() requires:",
        options: [
          "Random order",
          "Sorted list and Comparator",
          "Only primitive arrays",
          "HashMap",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Which sort is stable in Java?",
        options: [
          "Arrays.sort() for primitives",
          "Collections.sort() (merge sort based)",
          "TreeSet ordering",
          "HashMap ordering",
        ],
        correct: 1,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m3-p2-s1",
        title: "Comparable vs Comparator",
        content:
          "Comparable builds ordering into the class. Comparator separates ordering logic — you can have multiple comparators for the same class without changing it.",
        codeExample: `import java.util.*;

class Employee implements Comparable<Employee> {
    String name;
    double salary;
    Employee(String n, double s) { name = n; salary = s; }

    @Override
    public int compareTo(Employee o) {
        return Double.compare(this.salary, o.salary);
    }
}

List<Employee> emps = Arrays.asList(
    new Employee("Alice", 75000),
    new Employee("Bob", 60000),
    new Employee("Charlie", 80000)
);

Collections.sort(emps); // natural order (salary)
emps.sort(Comparator.comparing(e -> e.name)); // by name`,
      },
      {
        id: "java-m3-p2-s2",
        title: "Using Iterators",
        content:
          "For-each uses the Iterator internally. Use explicit Iterator when you need to remove elements safely during traversal.",
        codeExample: `List<String> words = new ArrayList<>(
    Arrays.asList("apple", "banana", "avocado", "cherry")
);

// Remove words starting with 'a' safely
Iterator<String> it = words.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("a")) {
        it.remove();
    }
}
System.out.println(words); // [banana, cherry]`,
      },
    ],
  },
  {
    id: "java-m3-p3",
    title: "Part 3: Queue, Deque & Stack",
    description:
      "Queue, Deque, ArrayDeque, PriorityQueue — use cases and operations.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=dzFoq2qxp_I",
    notes: `QUEUE, DEQUE & STACK

Queue: FIFO — first in, first out. Used for task queues, BFS.
Deque: Double-ended queue — can add/remove from both ends. Also works as a Stack.
PriorityQueue: Heap-based — elements dequeued in priority order.

Queue<String> queue = new LinkedList<>();
queue.offer("first");
queue.offer("second");
System.out.println(queue.poll()); // "first"

// Stack operations via Deque (preferred over Stack class)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.push(2); stack.push(3);
System.out.println(stack.pop()); // 3 (LIFO)

// PriorityQueue (min-heap by default)
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.add(5); pq.add(1); pq.add(3);
System.out.println(pq.poll()); // 1 (smallest first)

// Max-heap with Comparator:
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Comparator.reverseOrder());`,
    docs: [],
    partQuiz: [
      {
        question: "Which Queue method throws exception on empty?",
        options: ["offer()", "poll()", "remove()", "peek()"],
        correct: 2,
        xp: 10,
      },
      {
        question: "Deque stands for:",
        options: [
          "Double-ended Queue",
          "Dual Entry Queue",
          "Data Exchange Queue",
          "Directed Equal Queue",
        ],
        correct: 0,
        xp: 10,
      },
      {
        question: "PriorityQueue is backed by:",
        options: ["LinkedList", "Array heap", "TreeMap", "HashMap"],
        correct: 1,
        xp: 10,
      },
      {
        question: "Which class should you use instead of Stack?",
        options: ["Vector", "ArrayList", "ArrayDeque", "LinkedList"],
        correct: 2,
        xp: 10,
      },
      {
        question: "Queue.peek() does what?",
        options: [
          "Removes head",
          "Returns head without removing",
          "Adds to tail",
          "Clears queue",
        ],
        correct: 1,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m3-p3-s1",
        title: "Queue and Deque",
        content:
          "LinkedList implements both Queue and Deque. ArrayDeque is faster for stack/queue operations. Use offer/poll (no exceptions) over add/remove.",
        codeExample: `import java.util.*;

// BFS with Queue
Queue<String> bfsQueue = new LinkedList<>();
bfsQueue.offer("root");
while (!bfsQueue.isEmpty()) {
    String node = bfsQueue.poll();
    System.out.println("Visiting: " + node);
    // add children...
}

// Deque as stack (LIFO)
Deque<String> stack = new ArrayDeque<>();
stack.push("a");
stack.push("b");
stack.push("c");
while (!stack.isEmpty()) {
    System.out.print(stack.pop() + " "); // c b a
}`,
      },
      {
        id: "java-m3-p3-s2",
        title: "PriorityQueue",
        content:
          "PriorityQueue maintains a heap — poll() always returns the minimum (by default). Create a max-heap with Comparator.reverseOrder(). Custom priority with lambda comparator.",
        codeExample: `PriorityQueue<int[]> tasks = new PriorityQueue<>(
    (a, b) -> a[0] - b[0] // sort by priority value (ascending)
);

tasks.offer(new int[]{3, 101}); // priority 3
tasks.offer(new int[]{1, 201}); // priority 1 (highest)
tasks.offer(new int[]{2, 301}); // priority 2

while (!tasks.isEmpty()) {
    int[] task = tasks.poll();
    System.out.println("Priority " + task[0] + " task: " + task[1]);
}
// Output: Priority 1, 2, 3`,
      },
    ],
  },
);

// ─── Additional Parts for Module 4: Threads & I/O ────────────────────────────

java_module4.parts.push(
  {
    id: "java-m4-p2",
    title: "Part 2: Streams & Lambda Expressions",
    description:
      "Java Streams API, lambda functions, method references, Optional.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=r_MbozD32eo",
    notes: `JAVA STREAMS & LAMBDAS

Java Streams (java.util.stream) provide a functional way to process collections.

// Filter, map, collect pipeline:
List<String> names = List.of("Alice","Bob","Charlie","Anna");
List<String> aNames = names.stream()
    .filter(n -> n.startsWith("A"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
// ["ALICE", "ANNA"]

// Reduce
int sum = IntStream.rangeClosed(1, 100).sum(); // 5050

// Stream of objects to map
Map<String, Integer> nameLengths = names.stream()
    .collect(Collectors.toMap(n -> n, String::length));

Optional handles null-safe values:
Optional<String> opt = Optional.ofNullable(getValue());
opt.ifPresent(System.out::println);
String result = opt.orElse("default");
String mapped = opt.map(String::toUpperCase).orElse("N/A");`,
    docs: [],
    partQuiz: [
      {
        question: "Which terminal operation collects stream results?",
        options: ["filter()", "map()", "collect()", "peek()"],
        correct: 2,
        xp: 10,
      },
      {
        question: "Stream.filter() takes a:",
        options: ["Function", "Predicate", "Consumer", "Supplier"],
        correct: 1,
        xp: 10,
      },
      {
        question: "What does Stream.map() do?",
        options: [
          "Filters elements",
          "Transforms each element",
          "Collects to list",
          "Sorts elements",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Optional.orElse() provides:",
        options: [
          "Alternative if value absent",
          "The value directly",
          "A stream",
          "A predicate",
        ],
        correct: 0,
        xp: 10,
      },
      {
        question: "Method reference :: is shorthand for:",
        options: [
          "Generic type bound",
          "Lambda calling a specific method",
          "Interface default",
          "Static import",
        ],
        correct: 1,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m4-p2-s1",
        title: "Stream Pipeline Basics",
        content:
          "A stream pipeline has a source, intermediate operations (lazy), and a terminal operation (triggers execution). Streams don't modify the original collection.",
        codeExample: `import java.util.*;
import java.util.stream.*;

List<Integer> nums = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Sum of even numbers squared
int result = nums.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(n -> n * n)
    .sum();
System.out.println(result); // 220

// Grouped by even/odd
Map<Boolean, List<Integer>> grouped = nums.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));`,
      },
      {
        id: "java-m4-p2-s2",
        title: "Method References and Optional",
        content:
          "Method references replace lambdas when the lambda just calls a method. Optional wraps nullable values — avoids NullPointerException with fluent API.",
        codeExample: `import java.util.Optional;

// Method references
List<String> names = List.of("Bob", "Alice", "Charlie");
names.stream().map(String::toUpperCase).forEach(System.out::println);

// Optional usage
Optional<String> opt = Optional.of("Hello");
String upper = opt
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .orElse("TOO SHORT");
System.out.println(upper); // HELLO

Optional<String> empty = Optional.empty();
System.out.println(empty.orElseGet(() -> "computed default"));`,
      },
    ],
  },
  {
    id: "java-m4-p3",
    title: "Part 3: Exception Handling & Generics",
    description:
      "Checked/unchecked exceptions, try-with-resources, custom exceptions, generics wildcards.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=r_MbozD32eo",
    notes: `EXCEPTIONS & GENERICS

Exception Hierarchy:
Throwable → Error (JVM issues) → Exception → RuntimeException (unchecked)
                                             → IOException (checked — must handle)

try-with-resources auto-closes:
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String line = br.readLine();
} // br.close() called automatically

Custom exceptions:
class InsufficientFundsException extends RuntimeException {
    private final double amount;
    public InsufficientFundsException(double amount) {
        super("Insufficient funds: need " + amount);
        this.amount = amount;
    }
    public double getAmount() { return amount; }
}

Generics Wildcards:
// Upper bounded: accept List<Number> or subtype
public double sumList(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}

// Lower bounded: accept List<Integer> or supertype
public void addNumbers(List<? super Integer> list) {
    list.add(1); list.add(2);
}`,
    docs: [],
    partQuiz: [
      {
        question: "Checked exceptions must be:",
        options: [
          "Ignored",
          "Caught or declared with throws",
          "Only caught",
          "Only thrown",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "RuntimeException is:",
        options: [
          "Checked",
          "Unchecked — no requirement to handle",
          "An Error",
          "Abstract",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "try-with-resources requires the resource to implement:",
        options: [
          "Closeable or AutoCloseable",
          "Serializable",
          "Comparable",
          "Iterable",
        ],
        correct: 0,
        xp: 10,
      },
      {
        question: "What does '? extends T' wildcard mean?",
        options: [
          "Any type",
          "T or any supertype of T",
          "T or any subtype of T",
          "Only T",
        ],
        correct: 2,
        xp: 10,
      },
      {
        question: "finally block runs:",
        options: [
          "Only on exception",
          "Only on success",
          "Always, even if exception thrown",
          "Only if return is called",
        ],
        correct: 2,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m4-p3-s1",
        title: "Exception Handling Patterns",
        content:
          "Catch specific exceptions before general ones. Use multi-catch (|) for handling multiple types. Custom exceptions add domain-specific error information.",
        codeExample: `class BankAccount {
    private double balance;

    public void withdraw(double amount) {
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        balance -= amount;
    }
}

try {
    account.withdraw(1000);
} catch (InsufficientFundsException e) {
    System.out.println("Need " + e.getAmount() + " more");
} catch (IllegalArgumentException | NullPointerException e) {
    System.out.println("Input error: " + e.getMessage());
} finally {
    System.out.println("Transaction attempted");
}`,
      },
      {
        id: "java-m4-p3-s2",
        title: "Generic Classes and Bounded Types",
        content:
          "Generic classes work with any type. Bounded type parameters restrict which types can be used. Wildcards allow flexibility in method signatures.",
        codeExample: `// Generic stack
class Stack<T> {
    private List<T> elements = new ArrayList<>();

    public void push(T item) { elements.add(item); }
    public T pop() {
        if (elements.isEmpty()) throw new NoSuchElementException();
        return elements.remove(elements.size() - 1);
    }
    public boolean isEmpty() { return elements.isEmpty(); }
}

Stack<String> stringStack = new Stack<>();
stringStack.push("hello");
System.out.println(stringStack.pop()); // hello

// Bounded type parameter
public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
      },
    ],
  },
);

// ─── Additional Parts for Module 5: Spring Boot ──────────────────────────────

java_module5.parts.push(
  {
    id: "java-m5-p2",
    title: "Part 2: JPA & Database Integration",
    description:
      "Spring Data JPA, entity relationships, JPQL queries, transactions.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    notes: `SPRING DATA JPA

JPA (Jakarta Persistence API) maps Java objects to database tables.

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false)
    private Double price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}

Spring Data JPA repositories give you CRUD for free:
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category cat);
    List<Product> findByPriceLessThan(double maxPrice);

    @Query("SELECT p FROM Product p WHERE p.price > :min ORDER BY p.price")
    List<Product> findExpensive(@Param("min") double min);
}

Relationships:
@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
private List<Product> products;`,
    docs: [],
    partQuiz: [
      {
        question: "@Entity marks:",
        options: [
          "A REST controller",
          "A JPA-managed class mapped to a DB table",
          "A Spring service",
          "A configuration bean",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "JpaRepository gives you CRUD methods:",
        options: [
          "Only findAll",
          "findAll, findById, save, delete, and more",
          "Only save and delete",
          "Custom methods only",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "What does @OneToMany express?",
        options: [
          "One column many types",
          "One entity relates to many of another",
          "One-to-one mapping",
          "Polymorphism",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "@Transactional ensures:",
        options: [
          "Thread safety",
          "Operations run atomically — all succeed or all rollback",
          "Lazy loading",
          "Eager loading",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "JPQL queries operate on:",
        options: [
          "SQL tables",
          "Java entity classes and fields",
          "JSON objects",
          "Spring beans",
        ],
        correct: 1,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m5-p2-s1",
        title: "Entity Relationships",
        content:
          "Map table relationships with @OneToOne, @OneToMany, @ManyToOne, @ManyToMany. Use @JoinColumn to specify the foreign key column. CascadeType controls what happens to children when parent changes.",
        codeExample: `@Entity
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}`,
      },
      {
        id: "java-m5-p2-s2",
        title: "Custom JPQL and Native Queries",
        content:
          "JPQL uses entity names and field names (not table/column names). @Query for custom queries. @Modifying for UPDATE/DELETE. Projections reduce data fetched.",
        codeExample: `public interface OrderRepository extends JpaRepository<Order, Long> {

    // JPQL
    @Query("SELECT o FROM Order o WHERE o.customer.email = :email AND o.total > :min")
    List<Order> findByCustomerEmailAndMinTotal(
        @Param("email") String email,
        @Param("min") double min
    );

    // Native SQL
    @Query(value = "SELECT * FROM orders WHERE status = ?1 LIMIT 10", nativeQuery = true)
    List<Order> findRecentByStatus(String status);

    // Bulk update
    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = 'ARCHIVED' WHERE o.createdAt < :cutoff")
    int archiveOldOrders(@Param("cutoff") LocalDateTime cutoff);
}`,
      },
    ],
  },
  {
    id: "java-m5-p3",
    title: "Part 3: Final Project — REST API",
    description:
      "Build a complete Spring Boot REST API with JPA, validation, security, and error handling.",
    hasCodingContent: true,
    videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    notes: `FINAL PROJECT: TASK MANAGER API

Build a complete REST API for a task management system with:
• User authentication (JWT)
• Task CRUD operations
• Data validation with @Valid
• Global exception handling
• Pagination and sorting

Project structure:
com.taskmanager
├── config/        → SecurityConfig, JwtConfig
├── controller/    → UserController, TaskController
├── dto/           → LoginRequest, TaskRequest, TaskResponse
├── entity/        → User, Task
├── exception/     → ResourceNotFoundException, GlobalExceptionHandler
├── repository/    → UserRepository, TaskRepository
└── service/       → AuthService, TaskService

Key endpoints:
POST   /api/auth/register  — Register user
POST   /api/auth/login     — Get JWT token
GET    /api/tasks          — Get paginated tasks (authenticated)
POST   /api/tasks          — Create task
PUT    /api/tasks/{id}     — Update task
DELETE /api/tasks/{id}     — Delete task

Validation with Bean Validation (@Valid):
public record TaskRequest(
    @NotBlank(message = "Title required") String title,
    @Size(max = 500) String description,
    @Future LocalDateTime dueDate,
    @NotNull Priority priority
) {}`,
    docs: [],
    partQuiz: [
      {
        question: "@Valid triggers:",
        options: [
          "JPA validation",
          "Bean Validation on method parameters",
          "Security checks",
          "Transaction rollback",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "What does @ControllerAdvice do?",
        options: [
          "Adds logging",
          "Provides global exception handlers",
          "Configures security",
          "Enables caching",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "Pageable in Spring Data enables:",
        options: [
          "Only sorting",
          "Pagination and sorting via JpaRepository",
          "Lazy loading",
          "Async queries",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "DTO (Data Transfer Object) is used to:",
        options: [
          "Map DB tables",
          "Control what data is exposed via API",
          "Define exceptions",
          "Configure beans",
        ],
        correct: 1,
        xp: 10,
      },
      {
        question: "@NotBlank validates that a string is:",
        options: [
          "Not null and not empty (not just whitespace)",
          "Not null only",
          "Has exactly 1 character",
          "Not equal to blank",
        ],
        correct: 0,
        xp: 10,
      },
    ] as CQuizQuestion[],
    subsections: [
      {
        id: "java-m5-p3-s1",
        title: "Validation and DTOs",
        content:
          "Use Bean Validation annotations on DTOs. @Valid in controller triggers validation. BindingResult or automatic 400 response on failure. MapStruct or manual mapping converts DTO ↔ entity.",
        codeExample: `// DTO with validation
public record CreateTaskRequest(
    @NotBlank(message = "Title is required") String title,
    @Size(max = 500) String description,
    @NotNull Priority priority
) {}

// Controller using @Valid
@PostMapping
public ResponseEntity<TaskResponse> create(
    @Valid @RequestBody CreateTaskRequest req,
    @AuthenticationPrincipal UserDetails user
) {
    Task task = taskService.create(req, user.getUsername());
    return ResponseEntity.status(201).body(toResponse(task));
}

// Global exception handler for validation errors
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleValidation(
    MethodArgumentNotValidException ex
) {
    Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
    return ResponseEntity.badRequest().body(errors);
}`,
      },
      {
        id: "java-m5-p3-s2",
        title: "Pagination and Sorting",
        content:
          "Spring Data supports Pageable parameter automatically. Pass page, size, and sort as query params. Returns Page<T> with total count, total pages, and content.",
        codeExample: `// Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByOwnerUsername(String username, Pageable pageable);
}

// Controller
@GetMapping
public ResponseEntity<Page<TaskResponse>> getTasks(
    @AuthenticationPrincipal UserDetails user,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "createdAt") String sortBy
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
    Page<Task> tasks = taskRepo.findByOwnerUsername(user.getUsername(), pageable);
    return ResponseEntity.ok(tasks.map(this::toResponse));
}
// GET /api/tasks?page=0&size=10&sortBy=dueDate`,
      },
    ],
  },
);

// ─── Exported Course ──────────────────────────────────────────────────────────

export const JAVA_DEVELOPER_COURSE: CModule[] = [
  java_module0,
  java_module1,
  java_module2,
  java_module3,
  java_module4,
  java_module5,
];

export const JAVA_DEVELOPER_ROADMAP_ENTRY = {
  id: "java-developer-course",
  title: "Java Developer",
  icon: "☕",
  color: "from-orange-500/20 to-red-500/10",
  tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  description:
    "Java basics, OOP, Collections, Multithreading, Spring Boot — 5 structured modules to job-ready.",
  level: "Beginner to Advanced",
  isCourse: true as const,
  topics: [],
};
