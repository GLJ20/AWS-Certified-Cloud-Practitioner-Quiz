/************************Variables************************/
    let currentQuestion = 0;
    let score = 0;

/************************Constant*************************/
    const beginnerQuestions = [
        {
            question: "Which of the following is a key benefit of AWS Cloud?",
            options: ["High upfront costs", "Manual scaling", "Global reach and elasticity", "Fixed capacity"],
            answer: "Global reach and elasticity"
        },
        {
            question: "What is the primary purpose of AWS IAM (Identity and Access Management)?",
            options: ["To monitor AWS billing reports", "To control user access and permissions", "To encrypt S3 buckets", "To optimize AWS pricing models"],
            answer: "To control user access and permissions"
        },
        {
            question: "Which AWS service is used to store and retrieve objects, such as files and images?",
            options: ["Amazon RDS", "Amazon S3", "AWS Lambda", "Amazon EC2"],
            answer: "Amazon S3"
        },
        {
            question: "Which AWS pricing model allows you to pay only for what you use, with no long-term commitments?",
            options: ["Reserved Instances", "Spot Instances", "On-Demand Instances", "Savings Plans"],
            answer: "On-Demand Instances"
        },
    ];
    const intermediateQuestions = [
        {
            question: "Which pillar of the AWS Well-Architected Framework focuses on reducing costs while maximizing business value?",
            options: ["Operational Excellence", "Security", "Reliability", "Cost Optimization"],
            answer: "Cost Optimization"
        },
        {
            question: "In the AWS Shared Responsibility Model, which of the following is AWS responsible for?",
            options: ["Managing security patches on customer applications", "Encrypting all customer data by default", "Securing the physical infrastructure of data centers", "Creating IAM policies for customer accounts"],
            answer: "Securing the physical infrastructure of data centers"
        },
        {
            question: "Which AWS networking service allows you to create a logically isolated network that you can configure with your own IP address range?",
            options: ["Amazon Route 53", "AWS Direct Connect", "Amazon VPC", "AWS Global Accelerator"],
            answer: "Amazon VPC"
        },
        {
            question: "Which AWS service provides detailed cost breakdowns and helps forecast future expenses?",
            options: ["AWS Cost Explorer", "AWS Shield", "AWS Snowball", "Amazon CloudWatch"],
            answer: "AWS Cost Explorer"
        },
    ];

    const correctAns  = new Audio("Audio/correct.mp3")
    const incorrectAns  = new Audio("Audio/incorrect.mp3")
    const userWon  = new Audio("Audio/yay.mp3")
    const userLost = new Audio("Audio/fail.mp3")

/****************Referenced cached elements**************/
    const bodyElm = document.querySelector("body")
    const beginnerElm = document.querySelector("#beginner");
    const intermediateElm = document.querySelector("#intermediate");
    const landingElm = document.querySelector(".landing-page");
    const quizPgElm = document.querySelector(".quiz-page");
    const toggleBtnElm = document.querySelector("#toggleLight")

/*************************Functions************************/
    const restartQuiz = () => {
        currentQuestion = 0;
        score = 0;
        landingElm.classList.remove("hide");
        quizPgElm.classList.remove("show");
    }
    //Handles the core quiz logic: Displays questions, checks answers, manages flow
    const gameFlow = (difficulty) => {
        let questionToUse;
        //Start by checking which category has been picked
        if (difficulty == "beginner") {
            questionToUse = beginnerQuestions;
        } else {
            questionToUse = intermediateQuestions;
        }
        //Ensure the quiz page is empty to display new questions each time
        quizPgElm.innerHTML = "";
        
        // Create and display the current question
        const h2Elm = document.createElement("h2");
        h2Elm.id = "question";
        h2Elm.textContent = questionToUse[currentQuestion].question;
        quizPgElm.appendChild(h2Elm);

        // Create answer buttons for each option in current question
        questionToUse[currentQuestion].options.forEach(option => {
            const btnElm = document.createElement("button");
            btnElm.classList.add("btn-option");
            btnElm.textContent = option;
            
            // Handle when user selects an answer
            btnElm.addEventListener("click", (event) => {
                const ansofuser = event.target.textContent;
                
                // Disable all answer buttons after selection to prevent multiple clicks
                const buttons = document.querySelectorAll(".btn-option");
                buttons.forEach(button => button.disabled = true);

                // Check if answer is correct and update UI accordingly
                if (ansofuser === questionToUse[currentQuestion].answer) {
                    btnElm.style.backgroundColor = "green";
                    correctAns.volume = 0.6; 
                    correctAns.play();
                    score++;
                } else {
                    btnElm.style.backgroundColor = "red";
                    incorrectAns.volume = 0.7; 
                    incorrectAns.play();
                }

                // Determine if quiz should continue or end
                if (currentQuestion < questionToUse.length - 1) { 
                    // Move to next question after 1.5 second delay
                    setTimeout(() => {
                        currentQuestion++;  
                        gameFlow(difficulty);  
                    }, 1500); 
                } else {
                    // Quiz complete - show results after delay
                    setTimeout(() => {
                        let result;
                        if (score >= 2){
                            result = "win"
                            userWon.volume = 0.1; 
                            userWon.play();
                            confetti();
                        }else{
                            result = "lose"
                            userLost.volume = 0.1; 
                            userLost.play();
                        }

                        // Display final results screen
                        quizPgElm.innerHTML = `
                        <h2>Quiz Completed!</h2>
                        <h3>Your score: ${score} out of ${questionToUse.length}</h3> 
                        <h3>You ${result}!!</h3>
                        <button class="btn-catg" id="restart-btn">restart</button>`;
                        
                        // Set up restart button functionality
                        quizPgElm.querySelector('#restart-btn').addEventListener('click', restartQuiz);
                    }, 1500);
                }
            });
            quizPgElm.appendChild(btnElm);
        });
        // Create and display question progress counter to let user know which question they are at
        const questionCounter = document.createElement("h4");
        questionCounter.id = "current-question";
        questionCounter.textContent = `${currentQuestion + 1} of ${questionToUse.length} questions`;
        quizPgElm.appendChild(questionCounter);
    }
    // Handles start button click - hides landing page and begins quiz
    const handleStart = (event) => {
        difficulty = event.target.id
        landingElm.classList.add("hide");
        quizPgElm.classList.add("show");
        gameFlow(difficulty);
    }
    // Toggles between light/dark mode based on switch 
    const toggleLight = () => {
        if(toggleBtnElm.checked == true){
            bodyElm.classList.toggle("light-mode")
        }else{
            bodyElm.classList.remove("light-mode")
        }
    }

    beginnerElm.addEventListener("click", handleStart);
    intermediateElm.addEventListener("click", handleStart)
    toggleBtnElm.addEventListener("click", toggleLight)