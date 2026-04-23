import type {
  CModule,
  CQuizQuestion,
  CTestProblem,
} from "./cProgrammingCourse";

// ─── Module 0: Orientation ────────────────────────────────────────────────────

const cloud_module0: CModule = {
  id: "cloud-module0",
  title: "Module 0: Getting Started",
  outcome:
    "Understand the course structure, learning path, how modules unlock, how quizzes work, and what XP you earn",
  isLocked: false,
  quizAfterModule: false,
  parts: [
    {
      id: "cloud-module0-orientation",
      title: "Course Orientation",
      description:
        "Welcome to Cloud Computing! Your companion will guide you through everything you need to know before you start.",
      videoUrl: "",
      hasCodingContent: false,
      notes: `WELCOME TO CLOUD COMPUTING!

Hey! I'm so excited to be your companion on this Cloud Computing journey! ☁️ Cloud is the backbone of modern technology — every major app you use runs on cloud infrastructure. From AWS to serverless functions to Kubernetes, you're about to learn the skills that power the internet!

COURSE OVERVIEW
Cloud computing delivers computing resources (servers, storage, databases, networking, software) over the internet on a pay-as-you-go basis. This course covers IaaS/PaaS/SaaS service models, AWS core services (EC2, S3, Lambda, RDS, VPC), serverless architecture, containerization with Docker and Kubernetes, cloud security and IAM best practices, and cost optimization strategies.

HOW THIS COURSE WORKS
This course has 3 modules, each unlocking after you complete the previous one. Each module has several Parts. Every Part contains: a Video (watch to learn), a Lesson (read for deeper understanding), a Documentation link (open in-app for reference), a Quiz (15 MCQs to test your knowledge). After all parts, there's a Module Test. Complete the test to unlock the next module!

HOW YOU EARN
• 5 XP per correct MCQ answer in quizzes
• 20 XP per completed coding question
• Badges for completing each module
• SP (Study Points) for in-app purchases
• GCoins for daily challenges and streaks

ESTIMATED COMPLETION TIME: ~35 hours
This is a practical cloud course. Dedicate 1–2 hours per day and you'll understand enterprise cloud architecture in about 4 weeks.

WHAT TO DO NEXT
Complete the Getting Started checklist below, then scroll down to Module 1 to begin! 🚀`,
      docs: [],
      partQuiz: [],
      partProgrammingQuestions: [],
      subsections: [
        {
          id: "cloud-module0-learning-path",
          title: "Your Learning Path",
          content: `Here's the complete roadmap for this Cloud Computing course:

1. Cloud Fundamentals — Cloud models (IaaS/PaaS/SaaS), major providers, deployment types
2. AWS/Azure/GCP — Core services: compute (EC2), storage (S3), database (RDS), networking (VPC)
3. Compute & Storage — EC2 instances, auto-scaling, S3 buckets, lifecycle policies, EBS
4. Networking — Load balancers, Route 53 DNS, CDN (CloudFront), VPC design
5. Serverless — AWS Lambda, API Gateway, event-driven architecture, SQS/SNS
6. Cost Optimization — CloudWatch monitoring, reserved instances, right-sizing, billing alerts`,
          codeExample: "",
        },
        {
          id: "cloud-module0-module-structure",
          title: "How Modules Work",
          content: `Each module in this course is broken into Parts. Here's how a typical Part is structured:

• Video — A curated video explaining the concept visually
• Lesson — In-depth readable content you can study at your own pace
• Documentation — In-app reference material for that topic
• Quiz — 15 multiple-choice questions (5 XP each) to reinforce learning

Cloud computing is primarily architecture and configuration-based, so most parts focus on conceptual understanding, design decisions, and configuration patterns rather than traditional code.

Module Unlock Rules:
• Module 1 is always unlocked and ready to start
• Each subsequent module unlocks after you pass the previous module's test
• You can retake quizzes to improve your score`,
          codeExample: "",
        },
        {
          id: "cloud-module0-checklist",
          title: "Getting Started Checklist",
          content: `Complete these steps before heading to Module 1:

1. Read the course overview above — understand what cloud computing is and why it matters
2. Meet your study companion — they'll guide you through every lesson with hints and encouragement
3. Understand how modules unlock — complete one module's test to access the next
4. Know how quizzes work — 15 MCQs per part to test your cloud knowledge
5. Check your XP progress bar in the sidebar — it grows as you complete lessons and quizzes
6. You're all set! Head to Module 1 below to begin your Cloud Computing journey 🎉`,
          codeExample: "",
        },
      ],
    },
  ],
  moduleQuiz: [],
  moduleTest: [],
};

// ─── Module 1: Cloud Fundamentals ────────────────────────────────────────────

const cloud_module1: CModule = {
  id: "cloud-fundamentals",
  title: "Module 1: Cloud Fundamentals",
  outcome:
    "Understand cloud computing models, major providers, and core AWS services.",
  isLocked: false,
  quizAfterModule: true,
  parts: [
    {
      id: "cloud-m1-p1",
      title: "Part 1: Cloud Models & Providers",
      description:
        "IaaS, PaaS, SaaS deployment models and the leading cloud providers.",
      hasCodingContent: false,
      videoUrl: "https://www.youtube.com/watch?v=M988_fsOSWo",
      notes:
        "Cloud computing delivers on-demand computing resources over the internet. The three service models are IaaS (you manage OS and above), PaaS (you manage applications and data), and SaaS (vendor manages everything). Deployment models include Public, Private, and Hybrid clouds. Major providers are AWS, Azure, and Google Cloud Platform (GCP).",
      docs: [],
      hasDocumentation: true,
      partQuiz: [
        {
          question:
            "Which cloud service model gives users the most control over the underlying infrastructure?",
          options: ["SaaS", "PaaS", "IaaS", "FaaS"],
          correct: 2,
          xp: 10,
        },
        {
          question:
            "What type of cloud is owned and operated by a single organization for its exclusive use?",
          options: [
            "Public cloud",
            "Hybrid cloud",
            "Community cloud",
            "Private cloud",
          ],
          correct: 3,
          xp: 10,
        },
        {
          question: "Which of the following is an example of SaaS?",
          options: [
            "AWS EC2",
            "Google App Engine",
            "Gmail",
            "Microsoft Azure VMs",
          ],
          correct: 2,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [],
      subsections: [
        {
          id: "cloud-m1-p1s1",
          title: "Service Models: IaaS, PaaS, SaaS",
          content:
            "IaaS (Infrastructure as a Service) provides virtualized computing resources — servers, storage, and networking — over the internet. You manage the OS, middleware, and applications while the provider manages the physical hardware. Examples: AWS EC2, Azure VMs, Google Compute Engine.\n\nPaaS (Platform as a Service) provides a managed platform for developing and deploying applications. The provider manages the runtime, middleware, and OS. You focus only on your application code and data. Examples: Heroku, Google App Engine, AWS Elastic Beanstalk.\n\nSaaS (Software as a Service) delivers ready-to-use software applications over the internet. The vendor manages everything — infrastructure, platform, and application. You just use the software. Examples: Gmail, Slack, Salesforce, Dropbox.",
          codeExample:
            "// IaaS example: provisioning an EC2 instance via AWS SDK\nconst AWS = require('aws-sdk');\nconst ec2 = new AWS.EC2({ region: 'us-east-1' });\n\nconst params = {\n  ImageId: 'ami-0c55b159cbfafe1f0', // Amazon Linux 2\n  InstanceType: 't2.micro',\n  MinCount: 1,\n  MaxCount: 1,\n};\n\nec2.runInstances(params, (err, data) => {\n  if (err) console.error('Error launching instance:', err);\n  else console.log('Instance ID:', data.Instances[0].InstanceId);\n});\n\n// PaaS example: deploying to Heroku via CLI\n// $ heroku create my-app\n// $ git push heroku main\n// Heroku handles OS, runtime, scaling — you just push code\n\n// SaaS: no code needed — just sign in and use the service",
          video: {
            youtubeId: "M988_fsOSWo",
            title: "IaaS vs PaaS vs SaaS Explained",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m1-p1s2",
          title: "Cloud Deployment Models & Major Providers",
          content:
            "Public cloud resources are owned and operated by a third-party provider and shared across multiple tenants. It offers scalability and cost efficiency. Private cloud is dedicated to a single organization, offering greater control and security. Hybrid cloud combines public and private cloud, allowing data and applications to move between them.\n\nAWS (Amazon Web Services) is the market leader with 200+ services. Microsoft Azure is strong in enterprise and hybrid scenarios. Google Cloud Platform (GCP) excels in data analytics and ML workloads. Each provider has global data center regions and availability zones for redundancy and low-latency access.",
          codeExample:
            "// Comparing providers by common service category\nconst cloudProviders = {\n  compute:   { AWS: 'EC2',          Azure: 'Virtual Machines', GCP: 'Compute Engine' },\n  storage:   { AWS: 'S3',           Azure: 'Blob Storage',     GCP: 'Cloud Storage'  },\n  database:  { AWS: 'RDS/DynamoDB', Azure: 'Azure SQL/CosmosDB',GCP: 'Cloud SQL/Spanner'},\n  functions: { AWS: 'Lambda',       Azure: 'Azure Functions',  GCP: 'Cloud Functions'},\n  container: { AWS: 'EKS/ECS',      Azure: 'AKS',              GCP: 'GKE'            },\n};\n\n// Choosing a region — always pick the region closest to your users\n// AWS: us-east-1, eu-west-1, ap-southeast-1\n// Azure: eastus, westeurope, southeastasia\n// GCP: us-central1, europe-west1, asia-east1\nconsole.log(cloudProviders.compute.AWS); // 'EC2'",
          video: {
            youtubeId: "M988_fsOSWo",
            title: "Cloud Providers Compared",
          },
          flowchart: "if-else",
        },
      ],
    },
    {
      id: "cloud-m1-p2",
      title: "Part 2: AWS Core Services",
      description: "EC2, S3, RDS, IAM, and VPC — the building blocks of AWS.",
      videoUrl: "https://www.youtube.com/watch?v=a9__D53WsUs",
      notes:
        "AWS core services form the backbone of most cloud architectures. EC2 provides resizable compute. S3 offers durable object storage. RDS manages relational databases. IAM controls access permissions. VPC isolates your resources in a private virtual network. Understanding these five services enables you to architect most production applications on AWS.",
      docs: [],
      hasDocumentation: true,
      partQuiz: [
        {
          question: "What AWS service provides scalable object storage?",
          options: ["EC2", "RDS", "S3", "Lambda"],
          correct: 2,
          xp: 10,
        },
        {
          question: "What does IAM stand for in AWS?",
          options: [
            "Internet Access Management",
            "Identity and Access Management",
            "Internal Application Monitor",
            "Instance Authentication Module",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which AWS service lets you isolate resources in a virtual private network?",
          options: ["Route 53", "CloudFront", "VPC", "ElastiCache"],
          correct: 2,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m1-p2-prog1",
          question: "Upload a File to S3",
          description:
            "Write a Node.js function uploadToS3(bucketName, key, fileContent) that uploads a string as an object to an AWS S3 bucket using the AWS SDK v3 and returns the object URL.",
          starterCode:
            "const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');\n\nconst client = new S3Client({ region: 'us-east-1' });\n\nasync function uploadToS3(bucketName, key, fileContent) {\n  // Upload fileContent to S3 and return the object URL\n}\n\nuploadToS3('my-bucket', 'hello.txt', 'Hello, Cloud!').then(console.log);\n",
          expectedOutput: "https://my-bucket.s3.amazonaws.com/hello.txt",
          hint: "Use PutObjectCommand with Bucket, Key, and Body parameters. After upload, construct the URL as https://{bucket}.s3.amazonaws.com/{key}.",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m1-p2s1",
          title: "EC2 & S3",
          content:
            "EC2 (Elastic Compute Cloud) provides resizable virtual machines in the cloud. You choose an AMI (Amazon Machine Image — the OS template), instance type (CPU/RAM), storage, and network settings. Instances can be On-Demand (pay per hour), Reserved (1–3 year commitment for discount), or Spot (bid on unused capacity for deep savings).\n\nS3 (Simple Storage Service) is AWS's object storage service. Data is stored as objects inside buckets. S3 is highly durable (99.999999999%), globally accessible, and supports versioning, lifecycle policies, and static website hosting. Use S3 for backups, media files, logs, and static assets.\n\nKey S3 concepts: Bucket (container), Key (file path/name), Object (the file + metadata), ACL/Bucket Policy (access control).",
          codeExample:
            "// List S3 buckets using AWS SDK v3\nconst { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');\nconst client = new S3Client({ region: 'us-east-1' });\n\nasync function listBuckets() {\n  const { Buckets } = await client.send(new ListBucketsCommand({}));\n  Buckets.forEach(b => console.log(b.Name, '—', b.CreationDate));\n}\nlistBuckets();\n\n// Upload a text file to S3\nconst { PutObjectCommand } = require('@aws-sdk/client-s3');\nasync function upload() {\n  await client.send(new PutObjectCommand({\n    Bucket: 'my-app-bucket',\n    Key:    'data/notes.txt',\n    Body:   'Hello from the cloud!',\n    ContentType: 'text/plain',\n  }));\n  console.log('Upload complete');\n}\nupload();",
          video: {
            youtubeId: "a9__D53WsUs",
            title: "AWS EC2 and S3 Explained",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m1-p2s2",
          title: "IAM, RDS & VPC",
          content:
            "IAM (Identity and Access Management) controls who can do what in your AWS account. You create Users (humans), Groups (collections of users), and Roles (permissions for services). Policies are JSON documents that define allowed/denied actions on resources. Always follow the principle of least privilege.\n\nRDS (Relational Database Service) provides managed relational databases: MySQL, PostgreSQL, MariaDB, SQL Server, and Aurora. AWS handles backups, patching, replication, and failover. You focus on your schema and queries.\n\nVPC (Virtual Private Cloud) creates an isolated network within AWS. You define subnets (public and private), route tables, internet gateways, and security groups (virtual firewalls per instance). Public subnets host load balancers; private subnets host databases and backend services.",
          codeExample:
            "// IAM policy: allow read-only S3 access (JSON)\nconst readOnlyS3Policy = {\n  Version: '2012-10-17',\n  Statement: [{\n    Effect:   'Allow',\n    Action:   ['s3:GetObject', 's3:ListBucket'],\n    Resource: [\n      'arn:aws:s3:::my-app-bucket',\n      'arn:aws:s3:::my-app-bucket/*',\n    ],\n  }],\n};\n\n// Connecting to RDS (PostgreSQL) from Node.js\nconst { Pool } = require('pg');\nconst pool = new Pool({\n  host:     process.env.RDS_HOSTNAME,\n  port:     5432,\n  database: process.env.RDS_DB_NAME,\n  user:     process.env.RDS_USERNAME,\n  password: process.env.RDS_PASSWORD,\n  ssl:      { rejectUnauthorized: false },\n});\n\nasync function getUsers() {\n  const { rows } = await pool.query('SELECT id, name FROM users LIMIT 10');\n  return rows;\n}\n\n// VPC CIDR example: 10.0.0.0/16 (65,536 IPs)\n// Public subnet:  10.0.1.0/24 (internet-facing)\n// Private subnet: 10.0.2.0/24 (databases, internal services)",
          video: { youtubeId: "a9__D53WsUs", title: "IAM, RDS and VPC on AWS" },
          flowchart: "if-else",
        },
      ],
    },
  ],
  moduleQuiz: [
    {
      question: "Which cloud service model is Gmail an example of?",
      options: ["IaaS", "PaaS", "SaaS", "FaaS"],
      correct: 2,
      xp: 10,
    },
    {
      question: "What AWS service provides managed relational databases?",
      options: ["DynamoDB", "RDS", "Redshift", "ElastiCache"],
      correct: 1,
      xp: 10,
    },
    {
      question: "Which principle should guide how you assign IAM permissions?",
      options: [
        "Maximum privilege",
        "Least privilege",
        "Shared privilege",
        "Role inheritance",
      ],
      correct: 1,
      xp: 10,
    },
  ] as CQuizQuestion[],
  moduleTest: [
    {
      id: "cloud-m1-test1",
      title: "List S3 Objects in a Bucket",
      description:
        "Write an async function listObjects(bucketName) using AWS SDK v3 that returns an array of object keys from the given S3 bucket. Handle the case where the bucket is empty and return an empty array.",
      starterCode:
        "const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');\nconst client = new S3Client({ region: 'us-east-1' });\n\nasync function listObjects(bucketName) {\n  // Return array of object keys from the bucket\n}\n\nlistObjects('my-test-bucket').then(keys => console.log(keys));\n",
      hints: [
        "Use ListObjectsV2Command with { Bucket: bucketName }",
        "The response has a Contents array — map it to get the Key of each object",
        "If Contents is undefined (empty bucket), return []",
      ],
    },
  ] as CTestProblem[],
};

// ─── Module 2: Cloud Architecture ────────────────────────────────────────────

const cloud_module2: CModule = {
  id: "cloud-architecture",
  title: "Module 2: Cloud Architecture",
  outcome:
    "Design serverless functions and deploy microservices on cloud platforms.",
  isLocked: true,
  quizAfterModule: true,
  parts: [
    {
      id: "cloud-m2-p1",
      title: "Part 1: Serverless Computing",
      description:
        "Function-as-a-Service, AWS Lambda, event-driven architecture, and cold starts.",
      videoUrl: "https://www.youtube.com/watch?v=97q30JjEq9Y",
      notes:
        "Serverless computing lets you run code without provisioning or managing servers. AWS Lambda executes functions in response to events (HTTP requests, S3 uploads, database changes). You pay only for execution time. The cloud provider handles scaling, patching, and availability automatically. Key challenges include cold starts, statelessness, and execution time limits.",
      docs: [],
      hasDocumentation: true,
      partQuiz: [
        {
          question: "What is a 'cold start' in serverless computing?",
          options: [
            "A function that runs at midnight",
            "Latency caused by initializing a new function container",
            "A function without any dependencies",
            "Running a function in a cold data center",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "What is the maximum execution timeout for an AWS Lambda function?",
          options: ["1 minute", "5 minutes", "15 minutes", "60 minutes"],
          correct: 2,
          xp: 10,
        },
        {
          question:
            "Which AWS service is used to expose Lambda functions as HTTP endpoints?",
          options: [
            "CloudFront",
            "Elastic Load Balancer",
            "API Gateway",
            "Route 53",
          ],
          correct: 2,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m2-p1-prog1",
          question: "Build a Lambda Handler",
          description:
            "Write an AWS Lambda handler function in Node.js that accepts a JSON body with a name field and returns a JSON response: { message: 'Hello, {name}!' } with statusCode 200. Return 400 if name is missing.",
          starterCode:
            "exports.handler = async (event) => {\n  // Parse body, validate 'name', return appropriate response\n};\n\n// Test locally:\nconst testEvent = { body: JSON.stringify({ name: 'Priya' }) };\nexports.handler(testEvent).then(console.log);\n",
          expectedOutput:
            '{"statusCode":200,"body":"{\\"message\\":\\"Hello, Priya!\\"}"}',
          hint: "Parse event.body with JSON.parse() — API Gateway sends body as a string. Return an object with statusCode, headers, and body (body must be a JSON string).",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m2-p1s1",
          title: "Function-as-a-Service & AWS Lambda",
          content:
            "Function-as-a-Service (FaaS) is the core of serverless. You deploy individual functions that are triggered by events. AWS Lambda supports Node.js, Python, Java, Go, Ruby, and custom runtimes. Each function has a handler — the entry point that receives an event object and a context object.\n\nLambda integrates natively with API Gateway (HTTP), S3 (file events), DynamoDB Streams, SNS/SQS (messaging), and EventBridge (scheduled tasks). The Lambda execution environment is stateless — no data persists between invocations. Use external storage (S3, DynamoDB, ElastiCache) for state.\n\nMemory is configurable from 128 MB to 10 GB; CPU scales proportionally. Pricing is per 1ms of execution time and number of requests — making it extremely cost-effective for variable workloads.",
          codeExample:
            "// AWS Lambda handler (Node.js 18.x)\nexports.handler = async (event, context) => {\n  console.log('Event:', JSON.stringify(event, null, 2));\n\n  // API Gateway proxy integration\n  const body = JSON.parse(event.body || '{}');\n  const { name = 'World' } = body;\n\n  return {\n    statusCode: 200,\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ message: `Hello, ${name}!`, requestId: context.awsRequestId }),\n  };\n};\n\n// Environment variables — store secrets here, never in code\nconst DB_URL = process.env.DATABASE_URL;\nconst API_KEY = process.env.EXTERNAL_API_KEY;\n\n// Warm-up pattern: initialize connections outside the handler\n// so they reuse across invocations (avoids repeated cold start cost)\nconst { Pool } = require('pg');\nconst pool = new Pool({ connectionString: DB_URL });\n\nexports.handler = async (event) => {\n  const result = await pool.query('SELECT NOW()');\n  return { statusCode: 200, body: JSON.stringify(result.rows[0]) };\n};",
          video: {
            youtubeId: "97q30JjEq9Y",
            title: "AWS Lambda & Serverless Explained",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m2-p1s2",
          title: "Event-Driven Architecture & Cold Starts",
          content:
            "Event-driven architecture (EDA) decouples producers and consumers through events. A producer emits an event (e.g., a file uploaded to S3); a consumer reacts to it (e.g., Lambda resizes the image). This enables loose coupling, independent scaling, and resilience.\n\nKey event sources: S3 triggers (file events), DynamoDB Streams (change data capture), SQS (queued messages), SNS (fan-out pub/sub), EventBridge (scheduled cron or custom event bus), and API Gateway (HTTP requests).\n\nCold starts occur when Lambda must initialize a new execution environment for the first time (or after a period of inactivity). This adds 100ms–1s of latency. Mitigation strategies: use Provisioned Concurrency (keep environments warm), minimize package size, and avoid heavy initialization inside the handler.",
          codeExample:
            "// S3 event trigger: resize image on upload\nexports.handler = async (event) => {\n  for (const record of event.Records) {\n    const bucket = record.s3.bucket.name;\n    const key    = decodeURIComponent(record.s3.object.key);\n    console.log(`Processing: s3://${bucket}/${key}`);\n    // Call image processing logic here\n  }\n};\n\n// SQS trigger: process messages from a queue\nexports.sqsHandler = async (event) => {\n  for (const message of event.Records) {\n    const payload = JSON.parse(message.body);\n    console.log('Processing order:', payload.orderId);\n    // Process order, then message is auto-deleted on success\n  }\n};\n\n// EventBridge scheduled rule (runs every 5 minutes)\n// Defined in serverless.yml:\n// events:\n//   - schedule: rate(5 minutes)\nexports.cronHandler = async () => {\n  console.log('Running scheduled cleanup job', new Date().toISOString());\n};",
          video: {
            youtubeId: "97q30JjEq9Y",
            title: "Event-Driven Architecture on AWS",
          },
          flowchart: "loop",
        },
      ],
    },
    {
      id: "cloud-m2-p2",
      title: "Part 2: Microservices on Cloud",
      description:
        "Containers, Docker, Kubernetes (EKS/GKE), and service mesh patterns.",
      videoUrl: "https://www.youtube.com/watch?v=1xo-0gCVhTU",
      notes:
        "Microservices break a monolithic application into small, independently deployable services. Each service owns its data and communicates via APIs or messages. Containers (Docker) package services consistently across environments. Kubernetes orchestrates containers at scale — handling deployment, scaling, health checks, and service discovery. AWS EKS and GCP GKE are managed Kubernetes services.",
      docs: [],
      hasDocumentation: true,
      partQuiz: [
        {
          question: "What is the primary purpose of a Dockerfile?",
          options: [
            "To configure a Kubernetes cluster",
            "To define the steps to build a Docker image",
            "To manage cloud IAM roles",
            "To declare microservice endpoints",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which Kubernetes resource manages a set of identical pod replicas?",
          options: ["Service", "ConfigMap", "Deployment", "Ingress"],
          correct: 2,
          xp: 10,
        },
        {
          question: "What does a Kubernetes Service do?",
          options: [
            "Builds Docker images",
            "Provides a stable network endpoint to a group of pods",
            "Stores configuration as environment variables",
            "Schedules pods on nodes",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m2-p2-prog1",
          question: "Write a Dockerfile for a Node.js App",
          description:
            "Write a production-ready Dockerfile for a Node.js Express application. The app lives in /app, uses port 3000, and should run as a non-root user. Use a multi-stage build to keep the final image small.",
          starterCode:
            "# Stage 1: Build\n# FROM node:18-alpine AS builder\n# ... install dependencies\n\n# Stage 2: Production\n# FROM node:18-alpine\n# ... copy only production artifacts, run as non-root user\n",
          expectedOutput: "Dockerfile with multi-stage build and non-root user",
          hint: "Use node:18-alpine as the base image. In the build stage: COPY package*.json ./ and RUN npm ci --only=production. In the final stage: create a non-root user with adduser and use USER to switch.",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m2-p2s1",
          title: "Containers & Docker",
          content:
            "A container packages an application with all its dependencies (code, runtime, libraries, config) into a single isolated unit. Unlike VMs, containers share the host OS kernel, making them lightweight and fast to start.\n\nDocker is the dominant container platform. Key concepts: Image (read-only template built from a Dockerfile), Container (a running instance of an image), Registry (image repository — Docker Hub, AWS ECR, GCR), Layer (each Dockerfile instruction adds a layer; layers are cached for faster builds).\n\nBest practices: use official base images, minimize layers, copy only what you need, run as non-root, use multi-stage builds for smaller production images, and never store secrets in images.",
          codeExample:
            '# Multi-stage Dockerfile for Node.js\n# Stage 1: install dependencies\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Stage 2: production image\nFROM node:18-alpine\nWORKDIR /app\n\n# Run as non-root user for security\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\n\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY . .\n\nUSER appuser\nEXPOSE 3000\nCMD ["node", "server.js"]\n\n# Build and run:\n# docker build -t my-api:latest .\n# docker run -p 3000:3000 --env-file .env my-api:latest',
          video: {
            youtubeId: "1xo-0gCVhTU",
            title: "Docker & Containers Explained",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m2-p2s2",
          title: "Kubernetes & Cloud Orchestration",
          content:
            "Kubernetes (K8s) is an open-source container orchestration platform. It automates deployment, scaling, self-healing, and load balancing of containerized applications.\n\nCore concepts: Pod (smallest unit — one or more containers sharing network/storage), Deployment (declares desired state — replicas, image version, rollout strategy), Service (stable DNS name and IP for a set of pods), Ingress (HTTP routing rules, TLS termination), ConfigMap/Secret (externalize configuration and secrets).\n\nAWS EKS (Elastic Kubernetes Service) and GCP GKE (Google Kubernetes Engine) are managed control planes — AWS/Google manage the master nodes, you manage worker nodes. Combine with HPA (Horizontal Pod Autoscaler) for automatic scaling based on CPU/memory or custom metrics.",
          codeExample:
            "# Kubernetes Deployment manifest\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-deployment\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: api\n  template:\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n      - name: api\n        image: my-registry/api:v1.2.0\n        ports:\n        - containerPort: 3000\n        env:\n        - name: DATABASE_URL\n          valueFrom:\n            secretKeyRef:\n              name: db-secret\n              key: url\n        resources:\n          requests: { cpu: '100m', memory: '128Mi' }\n          limits:   { cpu: '500m', memory: '512Mi' }\n---\n# Service to expose the deployment\napiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  selector:\n    app: api\n  ports:\n  - port: 80\n    targetPort: 3000\n  type: LoadBalancer",
          video: { youtubeId: "1xo-0gCVhTU", title: "Kubernetes on AWS EKS" },
          flowchart: "loop",
        },
      ],
    },
  ],
  moduleQuiz: [
    {
      question: "What does 'stateless' mean in the context of AWS Lambda?",
      options: [
        "Lambda functions cannot access the internet",
        "No data is persisted in memory between separate invocations",
        "Lambda only runs synchronously",
        "Lambda cannot write to databases",
      ],
      correct: 1,
      xp: 10,
    },
    {
      question: "What is the advantage of multi-stage Docker builds?",
      options: [
        "They allow running multiple apps in one container",
        "They reduce the final image size by discarding build-only dependencies",
        "They automatically push images to a registry",
        "They enable containers to share the same network namespace",
      ],
      correct: 1,
      xp: 10,
    },
    {
      question:
        "Which Kubernetes object provides a stable network identity for a set of pods?",
      options: ["Deployment", "Ingress", "Service", "ReplicaSet"],
      correct: 2,
      xp: 10,
    },
  ] as CQuizQuestion[],
  moduleTest: [
    {
      id: "cloud-m2-test1",
      title: "Build a Serverless API Route",
      description:
        "Write an AWS Lambda handler that acts as a REST API endpoint. It should handle GET requests by returning a JSON list of products (hardcode 3 items with id, name, price). Return a 405 status for all other HTTP methods.",
      starterCode:
        "exports.handler = async (event) => {\n  const method = event.httpMethod;\n  // Handle GET: return product list\n  // Handle other methods: return 405\n};\n\n// Test:\nexports.handler({ httpMethod: 'GET' }).then(console.log);\nexports.handler({ httpMethod: 'POST' }).then(console.log);\n",
      hints: [
        "Check event.httpMethod — return early with 405 for non-GET requests",
        "Define a products array with 3 objects, each having id, name, and price",
        "Always return an object with statusCode, headers, and a JSON-stringified body",
      ],
    },
  ] as CTestProblem[],
};

// ─── Module 3: Cloud Operations ───────────────────────────────────────────────

const cloud_module3: CModule = {
  id: "cloud-operations",
  title: "Module 3: Cloud Operations",
  outcome:
    "Implement cloud security with IAM, monitor costs, and optimize cloud spending.",
  isLocked: true,
  quizAfterModule: true,
  parts: [
    {
      id: "cloud-m3-p1",
      title: "Part 1: Cloud Security & IAM",
      description:
        "IAM best practices, security groups, encryption at rest and in transit, and compliance.",
      videoUrl: "https://www.youtube.com/watch?v=iF9fs8Rw4Uo",
      notes:
        "Cloud security is a shared responsibility model — the cloud provider secures the infrastructure; you secure your data, identities, and applications. IAM (Identity and Access Management) is the first line of defense: enforce least privilege, use roles instead of long-term credentials, enable MFA, and audit with CloudTrail. Encrypt data at rest (S3 SSE, RDS encryption) and in transit (TLS). Use security groups and NACLs to restrict network traffic.",
      docs: [],
      hasDocumentation: true,
      partQuiz: [
        {
          question: "What is the AWS Shared Responsibility Model?",
          options: [
            "AWS and the customer split the bill 50/50",
            "AWS secures the cloud infrastructure; the customer secures their data and applications",
            "The customer manages all security including physical hardware",
            "AWS manages everything including customer data",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which AWS service logs all API calls made in your account for auditing?",
          options: ["CloudWatch", "CloudTrail", "Config", "GuardDuty"],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "What is the recommended way for an EC2 instance to access S3 without storing credentials?",
          options: [
            "Store AWS keys in environment variables",
            "Hard-code credentials in the application",
            "Assign an IAM Role to the EC2 instance",
            "Use the root account credentials",
          ],
          correct: 2,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m3-p1-prog1",
          question: "Validate an IAM Policy",
          description:
            "Write a JavaScript function validatePolicy(policy) that checks if an IAM-like policy object is valid. It should return { valid: true } if the policy has a Version string and a non-empty Statement array where each statement has Effect ('Allow' or 'Deny'), Action (string or array), and Resource (string or array). Otherwise return { valid: false, reason: '...' }.",
          starterCode:
            "function validatePolicy(policy) {\n  // Validate Version, Statement array, and each statement\n}\n\nconsole.log(validatePolicy({\n  Version: '2012-10-17',\n  Statement: [{ Effect: 'Allow', Action: 's3:GetObject', Resource: '*' }]\n})); // { valid: true }\n\nconsole.log(validatePolicy({\n  Statement: [{ Effect: 'Grant', Action: 's3:*', Resource: '*' }]\n})); // { valid: false, reason: '...' }\n",
          expectedOutput: "{ valid: true }",
          hint: "Check for the presence and type of policy.Version first. Verify policy.Statement is an array with length > 0. For each statement, check Effect is 'Allow' or 'Deny', and that Action and Resource exist.",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m3-p1s1",
          title: "IAM Best Practices & Shared Responsibility",
          content:
            "The AWS Shared Responsibility Model divides security into two domains: AWS is responsible for security OF the cloud (physical infrastructure, hardware, managed service software), while you are responsible for security IN the cloud (data, OS patching, network configuration, IAM policies, application security).\n\nIAM best practices: never use the root account for daily operations (create admin IAM users), enable MFA on all users especially root, grant least privilege (minimum permissions needed), use IAM Roles for EC2/Lambda instead of embedding access keys, rotate credentials regularly, use IAM Access Analyzer to detect overly permissive policies, and review with AWS Trusted Advisor.\n\nAWS CloudTrail records all API calls in your account — who did what, from where, and when. Enable CloudTrail in all regions and store logs in S3 with encryption.",
          codeExample:
            "// IAM policy: least privilege for a Lambda reading from DynamoDB\nconst lambdaPolicy = {\n  Version: '2012-10-17',\n  Statement: [\n    {\n      Effect:   'Allow',\n      Action:   [\n        'dynamodb:GetItem',\n        'dynamodb:Query',\n        'dynamodb:Scan',\n      ],\n      Resource: 'arn:aws:dynamodb:us-east-1:123456789012:table/Users',\n    },\n    {\n      Effect:   'Allow',\n      Action:   ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],\n      Resource: 'arn:aws:logs:*:*:*',\n    },\n  ],\n};\n\n// Check if a policy allows an action (simplified)\nfunction isAllowed(policy, action, resource) {\n  return policy.Statement.some(\n    s => s.Effect === 'Allow' &&\n         (s.Action === '*' || [].concat(s.Action).includes(action)) &&\n         (s.Resource === '*' || [].concat(s.Resource).some(r => resource.startsWith(r.replace('*', ''))))\n  );\n}\n\nconsole.log(isAllowed(lambdaPolicy, 'dynamodb:GetItem', 'arn:aws:dynamodb:us-east-1:123456789012:table/Users')); // true\nconsole.log(isAllowed(lambdaPolicy, 'dynamodb:DeleteItem', 'arn:aws:dynamodb:us-east-1:123456789012:table/Users')); // false",
          video: {
            youtubeId: "iF9fs8Rw4Uo",
            title: "AWS IAM Security Best Practices",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m3-p1s2",
          title: "Encryption & Network Security",
          content:
            "Encryption at rest protects stored data. S3 provides server-side encryption (SSE-S3, SSE-KMS, SSE-C). RDS supports encryption at the storage level using AWS KMS. EBS volumes can be encrypted. Enable encryption by default across all storage services.\n\nEncryption in transit uses TLS (Transport Layer Security). All AWS service endpoints support HTTPS. For custom applications, use ACM (AWS Certificate Manager) to provision free TLS certificates for your load balancers and CloudFront distributions.\n\nNetwork security: Security Groups act as stateful virtual firewalls per EC2 instance/RDS — allow only required ports and sources. NACLs (Network ACLs) are stateless rules at the subnet level. Use private subnets for databases and backend services; expose only load balancers in public subnets. AWS WAF (Web Application Firewall) filters malicious HTTP traffic.",
          codeExample:
            "// Generating a data encryption key using AWS KMS\nconst AWS = require('aws-sdk');\nconst kms = new AWS.KMS({ region: 'us-east-1' });\n\nasync function generateDataKey(keyId) {\n  const { Plaintext, CiphertextBlob } = await kms.generateDataKey({\n    KeyId:    keyId,\n    KeySpec:  'AES_256',\n  }).promise();\n  // Use Plaintext to encrypt data locally, then discard it from memory\n  // Store CiphertextBlob alongside encrypted data\n  return { plainKey: Plaintext, encryptedKey: CiphertextBlob };\n}\n\n// Security group rule: allow HTTPS only from CloudFront IP ranges\n// (defined in AWS Managed Prefix List)\n// Inbound rules:\n// Port 443 (HTTPS) from pl-xxxxxxxx (CloudFront)\n// Port 22 (SSH) from YOUR_OFFICE_IP/32 only — never 0.0.0.0/0!\n\n// Force HTTPS: redirect HTTP to HTTPS on load balancer\n// ALB Listener rule (pseudo-config):\n// IF protocol = HTTP → Redirect to HTTPS 301",
          video: {
            youtubeId: "iF9fs8Rw4Uo",
            title: "Cloud Encryption & Network Security",
          },
          flowchart: "if-else",
        },
      ],
    },
    {
      id: "cloud-m3-p2",
      title: "Part 2: Cost Optimization & Monitoring",
      description:
        "CloudWatch, cost management strategies, Reserved Instances, and auto-scaling.",
      videoUrl: "https://www.youtube.com/watch?v=dcJG3c9JDDE",
      notes:
        "Cloud costs can spiral without proper visibility and controls. CloudWatch provides metrics, logs, alarms, and dashboards to monitor your infrastructure. Cost Explorer and AWS Budgets give spending visibility and alerts. Optimization strategies: right-size instances, use Savings Plans or Reserved Instances for predictable workloads, leverage Spot Instances for fault-tolerant jobs, and enable auto-scaling to match capacity with demand.",
      docs: [],
      hasDocumentation: true,
      partQuiz: [
        {
          question:
            "Which AWS service provides metrics, logs, and alarms for your cloud resources?",
          options: ["CloudTrail", "CloudWatch", "X-Ray", "Config"],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which EC2 pricing model offers the deepest discount for interruptible workloads?",
          options: [
            "On-Demand",
            "Reserved Instances",
            "Spot Instances",
            "Dedicated Hosts",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "What does Auto Scaling in AWS primarily help with?",
          options: [
            "Automatically encrypting S3 buckets",
            "Adjusting compute capacity based on demand to optimize cost and performance",
            "Automatically renewing SSL certificates",
            "Replicating data across regions",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m3-p2-prog1",
          question: "Parse CloudWatch Alarm Data",
          description:
            "Write a function parseAlarm(alarmData) that takes a CloudWatch alarm state change event object and returns a summary object with: alarmName (string), state ('OK' | 'ALARM' | 'INSUFFICIENT_DATA'), metric (string), threshold (number), and isTriggered (boolean — true if state is 'ALARM').",
          starterCode:
            "function parseAlarm(alarmData) {\n  // Extract and return alarm summary\n}\n\nconst sampleEvent = {\n  AlarmName: 'HighCPUAlarm',\n  NewStateValue: 'ALARM',\n  Trigger: {\n    MetricName: 'CPUUtilization',\n    Threshold: 80,\n  },\n};\n\nconsole.log(parseAlarm(sampleEvent));\n// { alarmName: 'HighCPUAlarm', state: 'ALARM', metric: 'CPUUtilization', threshold: 80, isTriggered: true }\n",
          expectedOutput:
            "{ alarmName: 'HighCPUAlarm', state: 'ALARM', metric: 'CPUUtilization', threshold: 80, isTriggered: true }",
          hint: "Map AlarmName, NewStateValue, Trigger.MetricName, and Trigger.Threshold from the input. isTriggered is true when NewStateValue === 'ALARM'.",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m3-p2s1",
          title: "CloudWatch Monitoring & Alarms",
          content:
            "AWS CloudWatch is the central observability service. It collects metrics (CPU, memory, network, custom application metrics), logs (from Lambda, EC2, containers, and applications), and traces (via X-Ray integration).\n\nKey CloudWatch features: Metrics — time-series data points from AWS services and custom sources. Alarms — trigger actions when a metric crosses a threshold (scale out, send SNS notification, trigger Lambda). Log Groups/Streams — centralized log storage with CloudWatch Logs Insights for querying. Dashboards — customizable real-time visualizations.\n\nPublish custom metrics from your application using PutMetricData. Create composite alarms combining multiple metrics with AND/OR logic. Set up alarms for: high CPU (> 80%), error rate (> 5%), latency (p99 > 1s), and disk space (< 20% free).",
          codeExample:
            "const AWS = require('aws-sdk');\nconst cloudwatch = new AWS.CloudWatch({ region: 'us-east-1' });\n\n// Publish a custom metric: API response time\nasync function publishResponseTime(endpoint, durationMs) {\n  await cloudwatch.putMetricData({\n    Namespace: 'MyApp/API',\n    MetricData: [{\n      MetricName: 'ResponseTime',\n      Value:      durationMs,\n      Unit:       'Milliseconds',\n      Dimensions: [{ Name: 'Endpoint', Value: endpoint }],\n    }],\n  }).promise();\n}\n\n// Create an alarm (CLI/SDK example)\n// If ResponseTime p99 > 1000ms for 2 consecutive periods → trigger alarm\nconst alarmParams = {\n  AlarmName:          'HighLatencyAlarm',\n  MetricName:         'ResponseTime',\n  Namespace:          'MyApp/API',\n  Statistic:          'p99',\n  Period:             60,              // 60 seconds\n  EvaluationPeriods:  2,\n  Threshold:          1000,\n  ComparisonOperator: 'GreaterThanThreshold',\n  AlarmActions:       ['arn:aws:sns:us-east-1:123456789012:AlertsTopic'],\n};\nawait cloudwatch.putMetricAlarm(alarmParams).promise();\nconsole.log('Alarm created');",
          video: {
            youtubeId: "dcJG3c9JDDE",
            title: "AWS CloudWatch Monitoring",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m3-p2s2",
          title: "Cost Optimization Strategies",
          content:
            "Cloud cost optimization is about matching spending to actual usage. Key strategies:\n\n1. Right-sizing: analyze CloudWatch metrics and downsize over-provisioned instances. AWS Compute Optimizer provides machine learning-based recommendations.\n\n2. Reserved Instances & Savings Plans: commit to 1 or 3 years of usage for up to 72% discount vs On-Demand. Savings Plans are more flexible — they apply to any instance type in a region.\n\n3. Spot Instances: unused EC2 capacity at up to 90% discount. Ideal for batch jobs, CI/CD, and stateless workloads that can tolerate interruptions.\n\n4. Auto Scaling: scale in when load drops to avoid paying for idle capacity. Use target tracking (maintain 70% CPU) or scheduled scaling for predictable patterns.\n\n5. S3 Lifecycle Policies: automatically move data to cheaper storage tiers (S3-IA, Glacier) after a set number of days.\n\n6. AWS Budgets: set cost and usage budgets with email/SNS alerts when thresholds are breached.",
          codeExample:
            "// S3 Lifecycle policy: move to Infrequent Access after 30 days, Glacier after 90\nconst lifecyclePolicy = {\n  Rules: [{\n    ID:     'ArchiveOldLogs',\n    Status: 'Enabled',\n    Filter: { Prefix: 'logs/' },\n    Transitions: [\n      { Days: 30,  StorageClass: 'STANDARD_IA' },\n      { Days: 90,  StorageClass: 'GLACIER'     },\n    ],\n    Expiration: { Days: 365 }, // delete after 1 year\n  }],\n};\n\n// Create a budget alert for $100/month\nconst AWS = require('aws-sdk');\nconst budgets = new AWS.Budgets({ region: 'us-east-1' });\nawait budgets.createBudget({\n  AccountId: '123456789012',\n  Budget: {\n    BudgetName:  'MonthlyBudget',\n    BudgetLimit: { Amount: '100', Unit: 'USD' },\n    TimeUnit:    'MONTHLY',\n    BudgetType:  'COST',\n  },\n  NotificationsWithSubscribers: [{\n    Notification: {\n      NotificationType:   'ACTUAL',\n      ComparisonOperator: 'GREATER_THAN',\n      Threshold:          80, // alert at 80% of budget\n    },\n    Subscribers: [{ SubscriptionType: 'EMAIL', Address: 'admin@mycompany.com' }],\n  }],\n}).promise();\nconsole.log('Budget created with alert at 80% usage');",
          video: {
            youtubeId: "dcJG3c9JDDE",
            title: "AWS Cost Optimization Strategies",
          },
          flowchart: "loop",
        },
      ],
    },
  ],
  moduleQuiz: [
    {
      question:
        "Which AWS service records all API calls in your account for audit and compliance?",
      options: ["CloudWatch", "CloudTrail", "Config", "Inspector"],
      correct: 1,
      xp: 10,
    },
    {
      question:
        "What is the most cost-effective EC2 option for a fault-tolerant batch processing job?",
      options: ["On-Demand", "Reserved", "Spot", "Dedicated"],
      correct: 2,
      xp: 10,
    },
    {
      question: "What does an S3 Lifecycle Policy do?",
      options: [
        "Automatically backs up your EC2 instances",
        "Moves or deletes objects after a defined number of days",
        "Enforces IAM policies on bucket access",
        "Enables versioning on S3 objects",
      ],
      correct: 1,
      xp: 10,
    },
  ] as CQuizQuestion[],
  moduleTest: [
    {
      id: "cloud-m3-test1",
      title: "Cost Estimator Function",
      description:
        "Write a function estimateMonthlyCost(resources) that takes an array of AWS resource objects and returns the total estimated monthly cost in USD. Each resource has a type ('ec2' | 's3' | 'rds'), a quantity, and an hourlyRate (for ec2/rds) or gbRate (for s3, per GB per month) and a gbSize for s3. EC2 and RDS run 730 hours/month.",
      starterCode:
        "function estimateMonthlyCost(resources) {\n  // Calculate and return total monthly cost\n}\n\nconst resources = [\n  { type: 'ec2', quantity: 2, hourlyRate: 0.0416 },  // 2x t3.medium\n  { type: 'rds', quantity: 1, hourlyRate: 0.085  },  // 1x db.t3.medium\n  { type: 's3',  quantity: 1, gbRate: 0.023, gbSize: 500 }, // 500 GB\n];\n\nconsole.log(estimateMonthlyCost(resources)); // ~72.78\n",
      hints: [
        "For 'ec2' and 'rds': cost = quantity * hourlyRate * 730",
        "For 's3': cost = quantity * gbRate * gbSize",
        "Use Array.reduce to sum all resource costs and round to 2 decimal places",
      ],
    },
  ] as CTestProblem[],
};

// ─── Module 4: Networking and Security ───────────────────────────────────────

const cloud_module4: CModule = {
  id: "cloud-networking-security",
  title: "Module 4: Networking and Security",
  outcome:
    "Design secure, well-connected cloud architectures using VPCs, IAM, load balancers, and firewalls.",
  isLocked: true,
  quizAfterModule: true,
  parts: [
    {
      id: "cloud-m4-p1",
      title: "Part 1: VPC and Networking",
      description:
        "Virtual Private Clouds, subnets, route tables, internet gateways, NAT, and load balancers.",
      videoUrl: "https://www.youtube.com/watch?v=fpxDGU2KdkA",
      notes:
        "A VPC (Virtual Private Cloud) is your own isolated network in the cloud. You control IP ranges (CIDR), subnets, route tables, and gateways. Public subnets host internet-facing resources (load balancers); private subnets host databases and backend services. NAT gateways let private-subnet resources initiate outbound internet traffic without being publicly reachable.",
      docs: [],
      partQuiz: [
        {
          question: "What does VPC stand for?",
          options: [
            "Virtual Private Cloud",
            "Virtual Public Container",
            "Virtual Processor Core",
            "Variable Private Cluster",
          ],
          correct: 0,
          xp: 10,
        },
        {
          question:
            "Which VPC component allows traffic from private subnets to reach the internet without being directly accessible?",
          options: [
            "Internet Gateway",
            "NAT Gateway",
            "Security Group",
            "VPC Peering",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "What is the function of a subnet in a VPC?",
          options: [
            "Encrypts all traffic",
            "Partitions the VPC IP range into smaller segments",
            "Manages DNS resolution",
            "Stores S3 objects",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "A security group in AWS is stateful, meaning:",
          options: [
            "Outbound rules must explicitly allow return traffic",
            "Return traffic is automatically allowed for permitted inbound connections",
            "All traffic is blocked by default",
            "Security groups apply at subnet level",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which component distributes incoming traffic across multiple EC2 instances?",
          options: [
            "NAT Gateway",
            "Internet Gateway",
            "Application Load Balancer",
            "Route Table",
          ],
          correct: 2,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m4-p1-prog1",
          question: "Compute Available IPs in a CIDR Block",
          description:
            "Write a function getCIDRInfo(cidr) that takes a CIDR string like '10.0.0.0/24' and returns an object with: network (string), prefix (number), totalIPs (number), and usableHosts (number, total minus network and broadcast addresses).",
          starterCode:
            "function getCIDRInfo(cidr) {\n  const [network, prefix] = cidr.split('/');\n  const p = parseInt(prefix);\n  // totalIPs = 2^(32 - prefix)\n  // usableHosts = totalIPs - 2\n}\n\nconsole.log(getCIDRInfo('10.0.0.0/24'));\n// { network: '10.0.0.0', prefix: 24, totalIPs: 256, usableHosts: 254 }\n",
          expectedOutput:
            "{ network: '10.0.0.0', prefix: 24, totalIPs: 256, usableHosts: 254 }",
          hint: "totalIPs = Math.pow(2, 32 - p). usableHosts = totalIPs - 2.",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m4-p1s1",
          title: "VPC Architecture",
          content:
            "A VPC spans all Availability Zones in a region. You carve it into subnets — public subnets have a route to an Internet Gateway; private subnets route through a NAT Gateway for outbound-only internet access. Route tables define where traffic flows. VPC peering connects two VPCs, allowing private communication. AWS Transit Gateway connects multiple VPCs and on-premises networks through a central hub.",
          codeExample:
            "# Typical 3-tier VPC layout (pseudo-config)\nvpc:\n  cidr: 10.0.0.0/16          # 65,536 IPs\n\nsubnets:\n  # Public — internet-facing load balancers\n  public-a:  10.0.1.0/24   # AZ-a, 254 usable hosts\n  public-b:  10.0.2.0/24   # AZ-b\n\n  # Private — application servers\n  private-a: 10.0.10.0/24  # AZ-a\n  private-b: 10.0.11.0/24  # AZ-b\n\n  # Database — most restricted\n  db-a:      10.0.20.0/24  # AZ-a, no internet route\n  db-b:      10.0.21.0/24  # AZ-b\n\nroute-tables:\n  public:  [0.0.0.0/0 → igw-xxxxxx]\n  private: [0.0.0.0/0 → nat-xxxxxx]\n  db:      []  # no internet route at all",
          video: { youtubeId: "fpxDGU2KdkA", title: "AWS VPC Deep Dive" },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m4-p1s2",
          title: "Load Balancers and Security Groups",
          content:
            "AWS has three load balancer types: Application Load Balancer (ALB) — Layer 7, HTTP/HTTPS routing by path or host; Network Load Balancer (NLB) — Layer 4, ultra-low latency TCP/UDP; Gateway Load Balancer (GWLB) — for inline security appliances. Security groups are virtual firewalls applied to instances — stateful, allow-only rules. NACLs (Network ACLs) are stateless rules at the subnet level providing an extra layer of defense.",
          codeExample:
            "// Security group rule examples (via AWS SDK v3)\nconst { EC2Client, AuthorizeSecurityGroupIngressCommand } = require('@aws-sdk/client-ec2');\nconst ec2 = new EC2Client({ region: 'us-east-1' });\n\n// Allow HTTPS from anywhere (public ALB)\nawait ec2.send(new AuthorizeSecurityGroupIngressCommand({\n  GroupId: 'sg-alb-xxxx',\n  IpPermissions: [{\n    IpProtocol: 'tcp',\n    FromPort: 443,\n    ToPort: 443,\n    IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'Public HTTPS' }],\n  }],\n}));\n\n// Allow app traffic only from ALB security group\nawait ec2.send(new AuthorizeSecurityGroupIngressCommand({\n  GroupId: 'sg-app-xxxx',\n  IpPermissions: [{\n    IpProtocol: 'tcp',\n    FromPort: 3000, ToPort: 3000,\n    UserIdGroupPairs: [{ GroupId: 'sg-alb-xxxx', Description: 'From ALB only' }],\n  }],\n}));\nconsole.log('Security groups configured');",
          video: { youtubeId: "fpxDGU2KdkA", title: "Load Balancers on AWS" },
          flowchart: "if-else",
        },
      ],
    },
    {
      id: "cloud-m4-p2",
      title: "Part 2: IAM Deep Dive and Compliance",
      description:
        "Advanced IAM: roles, policies, cross-account access, STS, and compliance tools.",
      videoUrl: "https://www.youtube.com/watch?v=y8cbKJAo3B4",
      notes:
        "Advanced IAM covers service-linked roles, permission boundaries, AWS Organizations SCPs, and the Security Token Service (STS) for temporary credentials. Compliance tools like AWS Config, CloudTrail, Security Hub, and GuardDuty help you maintain a strong security posture.",
      docs: [],
      partQuiz: [
        {
          question: "What does STS provide in AWS?",
          options: [
            "Static access keys",
            "Temporary, limited-privilege credentials",
            "SSL certificate management",
            "Storage transfer service",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "A Service Control Policy (SCP) in AWS Organizations:",
          options: [
            "Grants permissions to IAM users",
            "Sets maximum permission boundaries for member accounts",
            "Encrypts S3 buckets",
            "Configures VPC routing",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which AWS service detects unusual API activity and threats?",
          options: ["AWS Config", "CloudTrail", "GuardDuty", "Inspector"],
          correct: 2,
          xp: 10,
        },
        {
          question: "Permission boundaries in IAM set the:",
          options: [
            "Minimum permissions a role can have",
            "Maximum permissions an IAM entity can have",
            "Default permissions for new users",
            "VPC traffic limits",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Cross-account access in AWS is granted via:",
          options: [
            "IAM Users copied to each account",
            "IAM Roles with trust policies allowing the other account",
            "Shared credentials files",
            "VPC Peering",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m4-p2-prog1",
          question: "Generate a Pre-signed S3 URL",
          description:
            "Write an async function getPresignedUrl(bucket, key, expiresInSeconds) using AWS SDK v3 and @aws-sdk/s3-request-presigner to generate a pre-signed GET URL for the specified object. Return the URL string.",
          starterCode:
            "const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');\nconst { getSignedUrl } = require('@aws-sdk/s3-request-presigner');\n\nconst client = new S3Client({ region: 'us-east-1' });\n\nasync function getPresignedUrl(bucket, key, expiresInSeconds = 3600) {\n  // Create command and return presigned URL\n}\n\ngetPresignedUrl('my-bucket', 'report.pdf', 900).then(console.log);\n",
          expectedOutput:
            "https://my-bucket.s3.amazonaws.com/report.pdf?X-Amz-...",
          hint: "Create a GetObjectCommand({ Bucket: bucket, Key: key }), then call getSignedUrl(client, command, { expiresIn: expiresInSeconds }).",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m4-p2s1",
          title: "Advanced IAM Patterns",
          content:
            "Cross-account roles: Account A creates a role with a trust policy allowing Account B to assume it. Account B uses STS AssumeRole to get temporary credentials. Permission boundaries cap what a role can do even if its policy grants more. AWS Organizations lets you apply Service Control Policies (SCPs) across all accounts — they act as a guardrail that even administrators cannot exceed. AWS SSO (Identity Center) provides centralized access management for multiple accounts.",
          codeExample:
            "// Assume a cross-account role using STS\nconst { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');\nconst sts = new STSClient({ region: 'us-east-1' });\n\nasync function assumeCrossAccountRole(roleArn, sessionName) {\n  const { Credentials } = await sts.send(new AssumeRoleCommand({\n    RoleArn:         roleArn,\n    RoleSessionName: sessionName,\n    DurationSeconds: 3600,  // 1 hour\n  }));\n\n  return {\n    accessKeyId:     Credentials.AccessKeyId,\n    secretAccessKey: Credentials.SecretAccessKey,\n    sessionToken:    Credentials.SessionToken,\n    expiration:      Credentials.Expiration,\n  };\n}\n\n// Then use these temp credentials for the target account\nconst creds = await assumeCrossAccountRole(\n  'arn:aws:iam::987654321098:role/ReadOnlyRole',\n  'audit-session'\n);\nconsole.log('Expires:', creds.expiration);",
          video: { youtubeId: "y8cbKJAo3B4", title: "Advanced IAM Patterns" },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m4-p2s2",
          title: "Compliance and Threat Detection",
          content:
            "AWS Config continuously records resource configurations and evaluates them against rules (e.g., 'all S3 buckets must have encryption enabled'). CloudTrail logs every API call — store logs in S3 with integrity validation for immutable audit trails. GuardDuty uses ML to detect threats: compromised credentials, cryptomining, unusual API calls from unknown IPs. AWS Security Hub aggregates findings from GuardDuty, Macie, Inspector, and third-party tools into a unified dashboard with compliance scores against CIS and PCI-DSS benchmarks.",
          codeExample:
            "// Create a CloudWatch alarm on GuardDuty HIGH-severity findings\nconst AWS = require('aws-sdk');\nconst events = new AWS.CloudWatchEvents({ region: 'us-east-1' });\n\n// EventBridge rule: match HIGH severity GuardDuty findings\nawait events.putRule({\n  Name:         'GuardDutyHighSeverity',\n  EventPattern: JSON.stringify({\n    source:      ['aws.guardduty'],\n    'detail-type': ['GuardDuty Finding'],\n    detail:      { severity: [{ numeric: ['>=', 7] }] },\n  }),\n  State: 'ENABLED',\n}).promise();\n\n// Send to SNS → email notification\nawait events.putTargets({\n  Rule: 'GuardDutyHighSeverity',\n  Targets: [{\n    Id:  'SecurityAlertSNS',\n    Arn: 'arn:aws:sns:us-east-1:123456789012:SecurityAlerts',\n  }],\n}).promise();\nconsole.log('GuardDuty alert configured');",
          video: { youtubeId: "y8cbKJAo3B4", title: "AWS Security Compliance" },
          flowchart: "if-else",
        },
      ],
    },
  ],
  moduleQuiz: [
    {
      question:
        "Which AWS component allows EC2 instances in a private subnet to reach the internet for outbound updates?",
      options: [
        "Internet Gateway",
        "NAT Gateway",
        "VPC Peering",
        "Security Group",
      ],
      correct: 1,
      xp: 10,
    },
    {
      question: "STS AssumeRole is used for:",
      options: [
        "Permanent credentials",
        "Temporary cross-account access",
        "S3 encryption",
        "VPC routing",
      ],
      correct: 1,
      xp: 10,
    },
    {
      question: "GuardDuty primarily detects:",
      options: [
        "Misconfigured S3 buckets",
        "Security threats and anomalous API activity using ML",
        "Unused EC2 instances",
        "High cloud bills",
      ],
      correct: 1,
      xp: 10,
    },
  ] as CQuizQuestion[],
  moduleTest: [
    {
      id: "cloud-m4-test1",
      title: "Validate CIDR Subnet Containment",
      description:
        "Write a function isIPInCIDR(ip, cidr) that returns true if the given IPv4 address falls within the CIDR block. Convert both to 32-bit integers for comparison. For example, isIPInCIDR('10.0.1.5', '10.0.0.0/16') should return true.",
      starterCode:
        "function ipToInt(ip) {\n  return ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet), 0) >>> 0;\n}\n\nfunction isIPInCIDR(ip, cidr) {\n  const [network, prefix] = cidr.split('/');\n  // Calculate network mask and compare\n}\n\nconsole.log(isIPInCIDR('10.0.1.5', '10.0.0.0/16'));  // true\nconsole.log(isIPInCIDR('192.168.1.1', '10.0.0.0/8')); // false\n",
      hints: [
        "mask = (0xFFFFFFFF << (32 - parseInt(prefix))) >>> 0",
        "networkInt = ipToInt(network) & mask",
        "Return (ipToInt(ip) & mask) === networkInt",
      ],
    },
  ] as CTestProblem[],
};

// ─── Module 5: Serverless and Containers ─────────────────────────────────────

const cloud_module5: CModule = {
  id: "cloud-serverless-containers",
  title: "Module 5: Serverless and Containers",
  outcome:
    "Build and deploy serverless functions and containerized applications on cloud platforms.",
  isLocked: true,
  quizAfterModule: true,
  parts: [
    {
      id: "cloud-m5-p1",
      title: "Part 1: Advanced Lambda and Cloud Functions",
      description:
        "Lambda layers, custom runtimes, Step Functions, EventBridge, and GCP Cloud Functions.",
      videoUrl: "https://www.youtube.com/watch?v=0y7ne-VAXVY",
      notes:
        "Lambda Layers let you share code and dependencies across functions. AWS Step Functions orchestrate multi-step serverless workflows using state machines. EventBridge provides a fully managed event bus for connecting services. Google Cloud Functions and Azure Functions provide equivalent capabilities on their respective platforms.",
      docs: [],
      partQuiz: [
        {
          question: "What is a Lambda Layer used for?",
          options: [
            "Adding more CPU to a function",
            "Sharing libraries and dependencies across multiple Lambda functions",
            "Routing Lambda traffic",
            "Storing Lambda logs",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "AWS Step Functions are used to:",
          options: [
            "Store state in DynamoDB",
            "Orchestrate multi-step serverless workflows with state machines",
            "Deploy Lambda layers",
            "Create VPC routes",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "EventBridge differs from SNS in that EventBridge:",
          options: [
            "Has no event filtering",
            "Is always slower",
            "Supports content-based event filtering and schema registry",
            "Only works with Lambda",
          ],
          correct: 2,
          xp: 10,
        },
        {
          question: "Provisioned Concurrency in Lambda:",
          options: [
            "Limits the number of concurrent executions",
            "Pre-warms execution environments to eliminate cold starts",
            "Reduces function memory",
            "Enables custom runtimes",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Lambda SnapStart feature helps by:",
          options: [
            "Taking database snapshots",
            "Caching initialized function snapshots to reduce cold start times",
            "Snapshotting S3 buckets",
            "Backing up Lambda code",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [
        {
          id: "cloud-m5-p1-prog1",
          question: "Step Function State Machine JSON",
          description:
            "Write a JavaScript function buildStateMachine(steps) that takes an array of step names (strings) and returns a valid AWS Step Functions state machine definition object in Amazon States Language (ASL) format. Each step should be a Task state that transitions to the next, with the last step ending the execution.",
          starterCode:
            "function buildStateMachine(steps) {\n  // Build and return an ASL state machine definition\n  // Each step: { Type: 'Task', Resource: 'arn:aws:lambda:...',\n  //              Next: nextStep } or End: true for last step\n}\n\nconst sm = buildStateMachine(['ValidateOrder', 'ProcessPayment', 'SendConfirmation']);\nconsole.log(JSON.stringify(sm, null, 2));\n",
          expectedOutput:
            "{ Comment: '...', StartAt: 'ValidateOrder', States: { ... } }",
          hint: "Create a States object where each key is a step name. For all but the last, add Next: steps[i+1]. For the last, add End: true. Set StartAt to steps[0].",
          xp: 20,
        },
      ],
      subsections: [
        {
          id: "cloud-m5-p1s1",
          title: "Lambda Layers and Advanced Patterns",
          content:
            "Lambda Layers are ZIP archives published as versioned artifacts. They are mounted at /opt and can contain shared libraries, utilities, or runtime extensions. Up to 5 layers per function. Custom runtimes let you run any language by implementing a runtime API (bootstrap binary). Lambda@Edge and CloudFront Functions run code at edge locations for ultra-low latency request processing. Powertools for Lambda provides utilities for logging, tracing, and metrics following best practices.",
          codeExample:
            "// Lambda with Layer and Powertools\nexports.handler = async (event) => {\n  // Powertools logger is available from Layer\n  const { Logger } = require('@aws-lambda-powertools/logger');\n  const { Tracer } = require('@aws-lambda-powertools/tracer');\n\n  const logger = new Logger({ serviceName: 'OrderService' });\n  const tracer = new Tracer({ serviceName: 'OrderService' });\n\n  const segment = tracer.getSegment();\n  const subsegment = segment.addNewSubsegment('processOrder');\n\n  try {\n    const body = JSON.parse(event.body || '{}');\n    logger.info('Processing order', { orderId: body.orderId });\n\n    // Business logic...\n    const result = await processOrder(body);\n\n    logger.info('Order processed', { result });\n    subsegment.close();\n    return { statusCode: 200, body: JSON.stringify(result) };\n  } catch (error) {\n    logger.error('Order failed', { error });\n    subsegment.addError(error);\n    subsegment.close();\n    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };\n  }\n};",
          video: {
            youtubeId: "0y7ne-VAXVY",
            title: "Advanced Lambda Patterns",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m5-p1s2",
          title: "Step Functions and EventBridge",
          content:
            "Step Functions uses Amazon States Language (ASL) — a JSON-based DSL to define state machines. State types: Task (Lambda/service call), Wait (pause), Choice (branching), Parallel (concurrent branches), Map (iterate over array). Error handling with Catch and Retry blocks make workflows resilient. EventBridge event buses route events from AWS services, custom apps, and SaaS partners. Content-based filtering (event patterns) routes events to the right targets without code.",
          codeExample:
            '// Step Functions state machine — order processing workflow\nconst stateMachine = {\n  Comment: "Order processing workflow",\n  StartAt: "ValidateOrder",\n  States: {\n    ValidateOrder: {\n      Type:     "Task",\n      Resource: "arn:aws:lambda:us-east-1:123:function:ValidateOrder",\n      Next:     "ProcessPayment",\n      Retry:    [{ ErrorEquals: ["Lambda.ServiceException"], MaxAttempts: 3, IntervalSeconds: 2 }],\n      Catch:    [{ ErrorEquals: ["ValidationError"], Next: "HandleError" }],\n    },\n    ProcessPayment: {\n      Type:     "Task",\n      Resource: "arn:aws:states:::dynamodb:putItem",\n      Parameters: {\n        TableName: "Payments",\n        Item: { "orderId.$": "$.orderId", "status.$": "$.paymentStatus" },\n      },\n      Next: "SendConfirmation",\n    },\n    SendConfirmation: {\n      Type: "Task",\n      Resource: "arn:aws:lambda:us-east-1:123:function:SendEmail",\n      End: true,\n    },\n    HandleError: { Type: "Fail", Error: "OrderFailed", Cause: "Validation error" },\n  },\n};',
          video: { youtubeId: "0y7ne-VAXVY", title: "Step Functions Workflow" },
          flowchart: "loop",
        },
      ],
    },
    {
      id: "cloud-m5-p2",
      title: "Part 2: Cloud Project — Deploy a Full Stack App",
      description:
        "Architect and deploy a complete serverless + containerized application to AWS.",
      hasCodingContent: false,
      videoUrl: "https://www.youtube.com/watch?v=oBSuXZ-OCfM",
      notes:
        "This capstone project ties together every module: VPC with public/private subnets, an ECS Fargate service for the API, Lambda functions for async jobs, RDS in a private subnet, S3 + CloudFront for the frontend, IAM roles with least privilege, and CloudWatch for monitoring. The goal is a production-grade architecture you can deploy with confidence.",
      docs: [],
      partQuiz: [
        {
          question: "ECS Fargate differs from ECS EC2 in that Fargate:",
          options: [
            "Requires you to manage EC2 instances",
            "Is serverless — AWS manages the underlying compute",
            "Only supports Linux containers",
            "Has no auto-scaling",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "For a React SPA, which combination provides global low-latency delivery?",
          options: [
            "EC2 + ELB",
            "S3 static hosting + CloudFront CDN",
            "Lambda + API Gateway",
            "ECS + NLB",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question:
            "Which service stores container images for ECS/EKS deployments?",
          options: ["S3", "ECR (Elastic Container Registry)", "EBS", "EFS"],
          correct: 1,
          xp: 10,
        },
        {
          question: "Blue-green deployment in AWS minimizes downtime by:",
          options: [
            "Shutting down the old environment immediately",
            "Running the new version in parallel and switching traffic atomically",
            "Using spot instances",
            "Reducing replica count",
          ],
          correct: 1,
          xp: 10,
        },
        {
          question: "Infrastructure as Code (IaC) tools for AWS include:",
          options: [
            "Docker Compose only",
            "AWS CloudFormation and Terraform",
            "NPM and Yarn",
            "Ansible only",
          ],
          correct: 1,
          xp: 10,
        },
      ] as CQuizQuestion[],
      partProgrammingQuestions: [],
      subsections: [
        {
          id: "cloud-m5-p2s1",
          title: "Full-Stack Architecture on AWS",
          content:
            "A production full-stack deployment on AWS typically follows this architecture: (1) Frontend: React SPA built and uploaded to S3, served via CloudFront with HTTPS. (2) API: Node.js/Python containerized API running on ECS Fargate in a private subnet, exposed via an ALB in public subnets. (3) Database: RDS PostgreSQL in a private DB subnet, only accessible from the ECS task's security group. (4) Async jobs: SQS-triggered Lambda functions for emails, report generation, and background processing. (5) CI/CD: GitHub Actions builds Docker images, pushes to ECR, and triggers ECS rolling deployment.",
          codeExample:
            "# docker-compose.yml for local dev (mirrors ECS structure)\nversion: '3.8'\nservices:\n  api:\n    build: ./api\n    ports: ['3000:3000']\n    environment:\n      DATABASE_URL: postgres://dev:dev@db:5432/myapp\n      NODE_ENV: development\n    depends_on: [db]\n\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_USER: dev\n      POSTGRES_PASSWORD: dev\n    volumes: ['pgdata:/var/lib/postgresql/data']\n\n  frontend:\n    build: ./frontend\n    ports: ['5173:5173']\n    environment:\n      VITE_API_URL: http://localhost:3000\n\nvolumes:\n  pgdata:\n\n# ECS task definition excerpt (production)\n# cpu: 256, memory: 512\n# container: { image: 123.dkr.ecr.us-east-1.amazonaws.com/api:latest }\n# environment from AWS Secrets Manager, not hardcoded",
          video: {
            youtubeId: "oBSuXZ-OCfM",
            title: "Deploy Full Stack App to AWS",
          },
          flowchart: "compilation-pipeline",
        },
        {
          id: "cloud-m5-p2s2",
          title: "IaC and CI/CD Pipeline",
          content:
            "Infrastructure as Code ensures your architecture is version-controlled and reproducible. AWS CloudFormation uses YAML/JSON templates; Terraform uses HCL and is cloud-agnostic. A CI/CD pipeline for cloud deployments: 1. Developer pushes code → GitHub Actions triggers. 2. Build: npm test → docker build → push to ECR. 3. Deploy: aws ecs update-service (rolling update) or trigger a CloudFormation stack update. 4. Monitor: CloudWatch dashboards + alarms auto-notify on error rate spikes. 5. Rollback: ECS deployment circuit breaker auto-reverts on health check failures.",
          codeExample:
            "# GitHub Actions CI/CD pipeline for ECS Fargate\nname: Deploy to AWS ECS\n\non:\n  push:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Configure AWS credentials\n        uses: aws-actions/configure-aws-credentials@v4\n        with:\n          aws-access-key-id:     ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region:            us-east-1\n\n      - name: Login to ECR\n        run: aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY\n        env:\n          ECR_REGISTRY: 123456789.dkr.ecr.us-east-1.amazonaws.com\n\n      - name: Build and push Docker image\n        run: |\n          docker build -t $ECR_REGISTRY/my-api:$GITHUB_SHA .\n          docker push $ECR_REGISTRY/my-api:$GITHUB_SHA\n\n      - name: Deploy to ECS\n        run: |\n          aws ecs update-service \\\n            --cluster production \\\n            --service my-api-service \\\n            --force-new-deployment",
          video: { youtubeId: "oBSuXZ-OCfM", title: "CI/CD for Cloud" },
          flowchart: "loop",
        },
      ],
    },
  ],
  moduleQuiz: [
    {
      question: "Lambda Layers allow you to:",
      options: [
        "Add more memory to functions",
        "Share code and libraries across multiple Lambda functions",
        "Create VPC connections",
        "Schedule Lambda executions",
      ],
      correct: 1,
      xp: 10,
    },
    {
      question: "ECS Fargate is serverless because:",
      options: [
        "It uses Lambda under the hood",
        "AWS manages the underlying EC2 instances for you",
        "Containers run without any CPU",
        "It only runs on weekdays",
      ],
      correct: 1,
      xp: 10,
    },
    {
      question: "Step Functions orchestrate workflows using:",
      options: [
        "SQL queries",
        "Amazon States Language (ASL) state machines",
        "YAML manifests only",
        "HTTP polling",
      ],
      correct: 1,
      xp: 10,
    },
  ] as CQuizQuestion[],
  moduleTest: [
    {
      id: "cloud-m5-test1",
      title: "Build a Step Function State Machine",
      description:
        "Write a function buildOrderWorkflow() that returns a valid Step Functions ASL state machine definition as a JavaScript object. The workflow must have 4 states: ValidateOrder (Task), CheckInventory (Task, includes a Choice state to branch to OutOfStock if inventory is 0), ProcessPayment (Task), and SendConfirmation (Task, End: true). Include error handling on ProcessPayment.",
      starterCode:
        "function buildOrderWorkflow() {\n  return {\n    Comment: 'E-commerce order processing',\n    StartAt: 'ValidateOrder',\n    States: {\n      // Define all 4 states here\n    },\n  };\n}\n\nconsole.log(JSON.stringify(buildOrderWorkflow(), null, 2));\n",
      hints: [
        "Each Task state needs Type: 'Task', Resource: 'arn:...', and either Next or End: true",
        "CheckInventory should be a Choice state with a condition: if $.inventory == 0 → OutOfStock, else → ProcessPayment",
        "Add Retry and Catch blocks to ProcessPayment for Lambda.ServiceException errors",
      ],
    },
  ] as CTestProblem[],
};

// ─── Course & Roadmap Entry Exports ──────────────────────────────────────────

export const CLOUD_COURSE = {
  id: "cloud-computing-course",
  title: "Cloud Computing",
  description:
    "Master cloud fundamentals, AWS core services, serverless architecture, containers, security best practices, and cost optimization to build and operate production-grade cloud applications.",
  modules: [
    cloud_module0,
    cloud_module1,
    cloud_module2,
    cloud_module3,
    cloud_module4,
    cloud_module5,
  ],
  allowChat: false,
  timeLimit: 30,
};

export const CLOUD_ROADMAP_ENTRY = {
  id: "cloud",
  title: "Cloud Computing",
  icon: "☁️",
  color: "from-sky-500 to-blue-600",
  description: "AWS, Azure, GCP, serverless, containers, and cloud operations",
  topics: [
    {
      id: "cloud-1",
      title: "Cloud Models & Providers",
      completed: false,
      xp: 50,
    },
    {
      id: "cloud-2",
      title: "AWS Core Services (EC2, S3, IAM, VPC, RDS)",
      completed: false,
      xp: 60,
    },
    {
      id: "cloud-3",
      title: "Serverless Computing & AWS Lambda",
      completed: false,
      xp: 55,
    },
    {
      id: "cloud-4",
      title: "Microservices, Docker & Kubernetes",
      completed: false,
      xp: 70,
    },
    {
      id: "cloud-5",
      title: "Cloud Security & IAM Best Practices",
      completed: false,
      xp: 65,
    },
    {
      id: "cloud-6",
      title: "Cost Optimization & CloudWatch Monitoring",
      completed: false,
      xp: 50,
    },
  ],
  courseRef: "cloud-computing-course",
};
