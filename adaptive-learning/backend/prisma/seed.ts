import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  // Clear in correct FK order
  await prisma.questionAttempt.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topicMastery.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create users
  await prisma.user.create({ data: { username: 'teacher', password: passwordHash, role: 'TEACHER' } });
  await prisma.user.create({ data: { username: 'student', password: passwordHash, role: 'STUDENT' } });

  // Subjects
  const math = await prisma.subject.create({ data: { name: 'Mathematics' } });
  const science = await prisma.subject.create({ data: { name: 'Science' } });
  const cs = await prisma.subject.create({ data: { name: 'Computer Science' } });
  const english = await prisma.subject.create({ data: { name: 'English' } });

  // Topics
  const algebra = await prisma.topic.create({ data: { name: 'Algebra', subjectId: math.id } });
  const geometry = await prisma.topic.create({ data: { name: 'Geometry', subjectId: math.id } });
  const trigonometry = await prisma.topic.create({ data: { name: 'Trigonometry', subjectId: math.id } });
  
  const physics = await prisma.topic.create({ data: { name: 'Physics', subjectId: science.id } });
  const chemistry = await prisma.topic.create({ data: { name: 'Chemistry', subjectId: science.id } });
  const biology = await prisma.topic.create({ data: { name: 'Biology', subjectId: science.id } });

  const dataStructures = await prisma.topic.create({ data: { name: 'Data Structures', subjectId: cs.id } });
  const programmingBasics = await prisma.topic.create({ data: { name: 'Programming Basics', subjectId: cs.id } });

  const grammar = await prisma.topic.create({ data: { name: 'Grammar', subjectId: english.id } });
  const vocabulary = await prisma.topic.create({ data: { name: 'Vocabulary', subjectId: english.id } });

  const questionsData = [
    // Mathematics - Algebra
    // Level 1
    { topicId: algebra.id, difficultyLevel: 1, content: "Solve for x: 2x = 4", options: JSON.stringify(["1", "2", "3", "4"]), correctOption: 1 },
    { topicId: algebra.id, difficultyLevel: 1, content: "What is 5 + x = 10?", options: JSON.stringify(["2", "3", "5", "10"]), correctOption: 2 },
    { topicId: algebra.id, difficultyLevel: 1, content: "Simplify: x + x", options: JSON.stringify(["2x", "x^2", "x", "2"]), correctOption: 0 },
    { topicId: algebra.id, difficultyLevel: 1, content: "Solve: x - 3 = 0", options: JSON.stringify(["0", "3", "-3", "1"]), correctOption: 1 },
    { topicId: algebra.id, difficultyLevel: 1, content: "Evaluate 2x when x=3", options: JSON.stringify(["5", "6", "8", "9"]), correctOption: 1 },
    // Level 2
    { topicId: algebra.id, difficultyLevel: 2, content: "Solve for x: 2x + 5 = 15", options: JSON.stringify(["5", "10", "15", "20"]), correctOption: 0 },
    { topicId: algebra.id, difficultyLevel: 2, content: "Simplify: 3(x + 2)", options: JSON.stringify(["3x + 2", "3x + 6", "x + 6", "3x"]), correctOption: 1 },
    { topicId: algebra.id, difficultyLevel: 2, content: "Solve: 4x - 2 = 2x + 6", options: JSON.stringify(["2", "3", "4", "5"]), correctOption: 2 },
    { topicId: algebra.id, difficultyLevel: 2, content: "Factor: x^2 - 4", options: JSON.stringify(["(x-2)(x+2)", "(x-4)(x+1)", "(x-2)(x-2)", "(x+2)(x+2)"]), correctOption: 0 },
    { topicId: algebra.id, difficultyLevel: 2, content: "Find x: x/2 + 3 = 7", options: JSON.stringify(["4", "6", "8", "10"]), correctOption: 2 },
    // Level 3
    { topicId: algebra.id, difficultyLevel: 3, content: "Solve the quadratic: x^2 - 5x + 6 = 0", options: JSON.stringify(["-2, -3", "2, 3", "1, 6", "-1, -6"]), correctOption: 1 },
    { topicId: algebra.id, difficultyLevel: 3, content: "Solve for x and y: x+y=5, x-y=1", options: JSON.stringify(["x=3, y=2", "x=2, y=3", "x=4, y=1", "x=1, y=4"]), correctOption: 0 },
    { topicId: algebra.id, difficultyLevel: 3, content: "Simplify: (x^3 * x^2) / x^4", options: JSON.stringify(["x", "x^2", "x^5", "1"]), correctOption: 0 },
    { topicId: algebra.id, difficultyLevel: 3, content: "Solve: |2x - 3| = 5", options: JSON.stringify(["x=4, x=-1", "x=4, x=1", "x=-4, x=1", "x=-4, x=-1"]), correctOption: 0 },
    { topicId: algebra.id, difficultyLevel: 3, content: "Expand: (x + 3)^2", options: JSON.stringify(["x^2 + 9", "x^2 + 6x + 9", "x^2 + 3x + 9", "2x + 6"]), correctOption: 1 },

    // Mathematics - Geometry
    // Level 1
    { topicId: geometry.id, difficultyLevel: 1, content: "How many sides does a triangle have?", options: JSON.stringify(["2", "3", "4", "5"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 1, content: "What is the sum of angles in a triangle?", options: JSON.stringify(["90", "180", "270", "360"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 1, content: "What is the perimeter of a square with side 4?", options: JSON.stringify(["8", "12", "16", "20"]), correctOption: 2 },
    { topicId: geometry.id, difficultyLevel: 1, content: "How many degrees in a right angle?", options: JSON.stringify(["45", "90", "180", "360"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 1, content: "What is the formula for the area of a rectangle?", options: JSON.stringify(["l+w", "2l+2w", "l*w", "l/w"]), correctOption: 2 },
    // Level 2
    { topicId: geometry.id, difficultyLevel: 2, content: "What is the area of a circle with radius r?", options: JSON.stringify(["pi*r", "pi*r^2", "2*pi*r", "4*pi*r^2"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 2, content: "Find the hypotenuse of a right triangle with sides 3 and 4.", options: JSON.stringify(["5", "6", "7", "8"]), correctOption: 0 },
    { topicId: geometry.id, difficultyLevel: 2, content: "What is the sum of interior angles of a pentagon?", options: JSON.stringify(["360", "540", "720", "900"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 2, content: "Volume of a cube with side 3?", options: JSON.stringify(["9", "18", "27", "36"]), correctOption: 2 },
    { topicId: geometry.id, difficultyLevel: 2, content: "Area of a triangle with base 10 and height 5?", options: JSON.stringify(["15", "25", "50", "100"]), correctOption: 1 },
    // Level 3
    { topicId: geometry.id, difficultyLevel: 3, content: "What is the volume of a sphere?", options: JSON.stringify(["(4/3)*pi*r^3", "4*pi*r^2", "pi*r^2*h", "(1/3)*pi*r^2*h"]), correctOption: 0 },
    { topicId: geometry.id, difficultyLevel: 3, content: "In a 30-60-90 triangle, if the shortest side is x, what is the hypotenuse?", options: JSON.stringify(["x*sqrt(3)", "2x", "x*sqrt(2)", "3x"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 3, content: "What is the surface area of a cylinder?", options: JSON.stringify(["pi*r^2*h", "2*pi*r*h", "2*pi*r^2 + 2*pi*r*h", "4*pi*r^2"]), correctOption: 2 },
    { topicId: geometry.id, difficultyLevel: 3, content: "Equation of a circle centered at (h,k) with radius r?", options: JSON.stringify(["(x-h)+(y-k)=r", "(x-h)^2+(y-k)^2=r^2", "x^2+y^2=r^2", "y=mx+b"]), correctOption: 1 },
    { topicId: geometry.id, difficultyLevel: 3, content: "Calculate the distance between (1, 2) and (4, 6)", options: JSON.stringify(["3", "4", "5", "7"]), correctOption: 2 },

    // Mathematics - Trigonometry
    // Level 1
    { topicId: trigonometry.id, difficultyLevel: 1, content: "What does sine represent in a right triangle?", options: JSON.stringify(["Opposite/Hypotenuse", "Adjacent/Hypotenuse", "Opposite/Adjacent", "Adjacent/Opposite"]), correctOption: 0 },
    { topicId: trigonometry.id, difficultyLevel: 1, content: "What does cosine represent?", options: JSON.stringify(["Opposite/Hypotenuse", "Adjacent/Hypotenuse", "Opposite/Adjacent", "Hypotenuse/Opposite"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 1, content: "What is sin(0)?", options: JSON.stringify(["0", "1", "-1", "undefined"]), correctOption: 0 },
    { topicId: trigonometry.id, difficultyLevel: 1, content: "What is cos(0)?", options: JSON.stringify(["0", "1", "-1", "undefined"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 1, content: "What is tan?", options: JSON.stringify(["sin/cos", "cos/sin", "1/sin", "1/cos"]), correctOption: 0 },
    // Level 2
    { topicId: trigonometry.id, difficultyLevel: 2, content: "What is sin(90 degrees)?", options: JSON.stringify(["0", "1", "-1", "undefined"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 2, content: "What is the Pythagorean identity?", options: JSON.stringify(["sin+cos=1", "sin^2+cos^2=1", "tan^2+1=sec", "1+cot=csc"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 2, content: "What is tan(45 degrees)?", options: JSON.stringify(["0", "1", "sqrt(2)", "undefined"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 2, content: "What is the period of the sine function?", options: JSON.stringify(["pi", "2*pi", "pi/2", "4*pi"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 2, content: "Convert 180 degrees to radians", options: JSON.stringify(["pi/2", "pi", "3pi/2", "2pi"]), correctOption: 1 },
    // Level 3
    { topicId: trigonometry.id, difficultyLevel: 3, content: "Use the Law of Sines: a/sin(A) =", options: JSON.stringify(["b/sin(C)", "b/sin(B)", "c/sin(B)", "1"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 3, content: "What is the double angle formula for sin(2x)?", options: JSON.stringify(["2sin(x)cos(x)", "cos^2(x)-sin^2(x)", "1-2sin^2(x)", "2cos^2(x)-1"]), correctOption: 0 },
    { topicId: trigonometry.id, difficultyLevel: 3, content: "Evaluate sec(60 degrees)", options: JSON.stringify(["1", "2", "sqrt(3)", "2/sqrt(3)"]), correctOption: 1 },
    { topicId: trigonometry.id, difficultyLevel: 3, content: "Law of Cosines: c^2 = a^2 + b^2 - ?", options: JSON.stringify(["2ab cos(C)", "ab cos(C)", "2ab sin(C)", "2ac cos(B)"]), correctOption: 0 },
    { topicId: trigonometry.id, difficultyLevel: 3, content: "What is the domain of inverse sine (arcsin)?", options: JSON.stringify(["All real numbers", "[-1, 1]", "(-pi/2, pi/2)", "[0, pi]"]), correctOption: 1 },

    // Science - Physics
    // Level 1
    { topicId: physics.id, difficultyLevel: 1, content: "What is the unit of force?", options: JSON.stringify(["Joule", "Newton", "Watt", "Volt"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 1, content: "What does 'g' represent on Earth?", options: JSON.stringify(["9.8 m/s^2", "3.14", "3x10^8 m/s", "6.67x10^-11"]), correctOption: 0 },
    { topicId: physics.id, difficultyLevel: 1, content: "What is the formula for speed?", options: JSON.stringify(["Distance/Time", "Time/Distance", "Mass*Acceleration", "Work/Time"]), correctOption: 0 },
    { topicId: physics.id, difficultyLevel: 1, content: "Energy of motion is called?", options: JSON.stringify(["Potential Energy", "Kinetic Energy", "Thermal Energy", "Chemical Energy"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 1, content: "What opposes motion between surfaces?", options: JSON.stringify(["Gravity", "Tension", "Friction", "Magnetism"]), correctOption: 2 },
    // Level 2
    { topicId: physics.id, difficultyLevel: 2, content: "Newton's Second Law?", options: JSON.stringify(["F=ma", "E=mc^2", "v=u+at", "p=mv"]), correctOption: 0 },
    { topicId: physics.id, difficultyLevel: 2, content: "What is the unit of work/energy?", options: JSON.stringify(["Newton", "Watt", "Joule", "Pascal"]), correctOption: 2 },
    { topicId: physics.id, difficultyLevel: 2, content: "Calculate momentum for mass 5kg and velocity 2m/s", options: JSON.stringify(["7", "10", "2.5", "25"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 2, content: "What is Ohm's Law?", options: JSON.stringify(["P=IV", "V=IR", "F=ma", "Q=CV"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 2, content: "Velocity is speed with what?", options: JSON.stringify(["Acceleration", "Mass", "Direction", "Time"]), correctOption: 2 },
    // Level 3
    { topicId: physics.id, difficultyLevel: 3, content: "What is the formula for kinetic energy?", options: JSON.stringify(["mgh", "1/2 mv^2", "mv", "Fd"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 3, content: "Centripetal force formula?", options: JSON.stringify(["mv^2/r", "mg", "kx", "GmM/r^2"]), correctOption: 0 },
    { topicId: physics.id, difficultyLevel: 3, content: "First law of thermodynamics relates to?", options: JSON.stringify(["Conservation of Momentum", "Conservation of Energy", "Entropy", "Relativity"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 3, content: "What is the speed of light in vacuum?", options: JSON.stringify(["3 x 10^5 m/s", "3 x 10^8 m/s", "3 x 10^6 m/s", "3 x 10^10 m/s"]), correctOption: 1 },
    { topicId: physics.id, difficultyLevel: 3, content: "Formula for capacitance?", options: JSON.stringify(["C = Q/V", "C = 1/2 QV", "C = V/R", "C = I*t"]), correctOption: 0 },

    // Science - Chemistry
    // Level 1
    { topicId: chemistry.id, difficultyLevel: 1, content: "What is H2O?", options: JSON.stringify(["Oxygen", "Water", "Hydrogen Peroxide", "Salt"]), correctOption: 1 },
    { topicId: chemistry.id, difficultyLevel: 1, content: "Symbol for Gold?", options: JSON.stringify(["Ag", "Au", "Gd", "Go"]), correctOption: 1 },
    { topicId: chemistry.id, difficultyLevel: 1, content: "What is the center of an atom called?", options: JSON.stringify(["Electron", "Proton", "Nucleus", "Neutron"]), correctOption: 2 },
    { topicId: chemistry.id, difficultyLevel: 1, content: "Charge of a proton?", options: JSON.stringify(["Positive", "Negative", "Neutral", "Variable"]), correctOption: 0 },
    { topicId: chemistry.id, difficultyLevel: 1, content: "Common name for NaCl?", options: JSON.stringify(["Sugar", "Baking Soda", "Table Salt", "Chalk"]), correctOption: 2 },
    // Level 2
    { topicId: chemistry.id, difficultyLevel: 2, content: "What type of bond shares electrons?", options: JSON.stringify(["Ionic", "Covalent", "Metallic", "Hydrogen"]), correctOption: 1 },
    { topicId: chemistry.id, difficultyLevel: 2, content: "pH of pure water?", options: JSON.stringify(["0", "7", "14", "10"]), correctOption: 1 },
    { topicId: chemistry.id, difficultyLevel: 2, content: "Atomic number of Carbon?", options: JSON.stringify(["6", "12", "14", "8"]), correctOption: 0 },
    { topicId: chemistry.id, difficultyLevel: 2, content: "What is a cation?", options: JSON.stringify(["Positively charged ion", "Negatively charged ion", "Neutral atom", "Isotope"]), correctOption: 0 },
    { topicId: chemistry.id, difficultyLevel: 2, content: "Avogadro's number is approximately?", options: JSON.stringify(["3.14 x 10^23", "6.02 x 10^23", "9.81 x 10^23", "1.6 x 10^-19"]), correctOption: 1 },
    // Level 3
    { topicId: chemistry.id, difficultyLevel: 3, content: "Ideal gas law equation?", options: JSON.stringify(["PV = nRT", "P1V1 = P2V2", "V1/T1 = V2/T2", "q = mcDT"]), correctOption: 0 },
    { topicId: chemistry.id, difficultyLevel: 3, content: "What is the electron configuration of Neon?", options: JSON.stringify(["1s2 2s2 2p6", "1s2 2s2 2p5", "1s2 2s2", "1s2"]), correctOption: 0 },
    { topicId: chemistry.id, difficultyLevel: 3, content: "Gibbs free energy equation?", options: JSON.stringify(["G = H - TS", "H = G - TS", "S = H - TG", "G = TS - H"]), correctOption: 0 },
    { topicId: chemistry.id, difficultyLevel: 3, content: "What defines an Arrhenius acid?", options: JSON.stringify(["Electron pair acceptor", "Proton donor", "Produces H+ in water", "Produces OH- in water"]), correctOption: 2 },
    { topicId: chemistry.id, difficultyLevel: 3, content: "What is the geometry of methane (CH4)?", options: JSON.stringify(["Planar", "Linear", "Tetrahedral", "Octahedral"]), correctOption: 2 },

    // Science - Biology
    // Level 1
    { topicId: biology.id, difficultyLevel: 1, content: "Powerhouse of the cell?", options: JSON.stringify(["Nucleus", "Ribosome", "Mitochondria", "Golgi"]), correctOption: 2 },
    { topicId: biology.id, difficultyLevel: 1, content: "What gas do plants absorb?", options: JSON.stringify(["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"]), correctOption: 2 },
    { topicId: biology.id, difficultyLevel: 1, content: "What pigment makes plants green?", options: JSON.stringify(["Melanin", "Hemoglobin", "Chlorophyll", "Carotene"]), correctOption: 2 },
    { topicId: biology.id, difficultyLevel: 1, content: "Basic unit of life?", options: JSON.stringify(["Atom", "Tissue", "Organ", "Cell"]), correctOption: 3 },
    { topicId: biology.id, difficultyLevel: 1, content: "How many bones in adult human?", options: JSON.stringify(["206", "256", "300", "150"]), correctOption: 0 },
    // Level 2
    { topicId: biology.id, difficultyLevel: 2, content: "Process of cell division for somatic cells?", options: JSON.stringify(["Meiosis", "Mitosis", "Binary Fission", "Budding"]), correctOption: 1 },
    { topicId: biology.id, difficultyLevel: 2, content: "What carries oxygen in blood?", options: JSON.stringify(["White blood cells", "Platelets", "Hemoglobin", "Plasma"]), correctOption: 2 },
    { topicId: biology.id, difficultyLevel: 2, content: "Shape of DNA?", options: JSON.stringify(["Single helix", "Double helix", "Triple helix", "Circular"]), correctOption: 1 },
    { topicId: biology.id, difficultyLevel: 2, content: "What is an autotroph?", options: JSON.stringify(["Eats other organisms", "Makes its own food", "Decomposes matter", "Parasite"]), correctOption: 1 },
    { topicId: biology.id, difficultyLevel: 2, content: "Where does photosynthesis occur?", options: JSON.stringify(["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"]), correctOption: 2 },
    // Level 3
    { topicId: biology.id, difficultyLevel: 3, content: "What are the four DNA bases?", options: JSON.stringify(["A, T, C, G", "A, U, C, G", "A, T, C, U", "A, B, C, D"]), correctOption: 0 },
    { topicId: biology.id, difficultyLevel: 3, content: "End product of glycolysis?", options: JSON.stringify(["Glucose", "Lactic Acid", "Pyruvate", "Acetyl CoA"]), correctOption: 2 },
    { topicId: biology.id, difficultyLevel: 3, content: "Which enzyme unzips DNA?", options: JSON.stringify(["Polymerase", "Ligase", "Helicase", "Primase"]), correctOption: 2 },
    { topicId: biology.id, difficultyLevel: 3, content: "Function of ribosomes?", options: JSON.stringify(["Energy production", "Protein synthesis", "Lipid synthesis", "Waste disposal"]), correctOption: 1 },
    { topicId: biology.id, difficultyLevel: 3, content: "Central dogma of molecular biology?", options: JSON.stringify(["RNA -> DNA -> Protein", "Protein -> RNA -> DNA", "DNA -> RNA -> Protein", "DNA -> Protein -> RNA"]), correctOption: 2 },

    // CS - Data Structures
    // Level 1
    { topicId: dataStructures.id, difficultyLevel: 1, content: "LIFO data structure?", options: JSON.stringify(["Queue", "Stack", "Array", "Tree"]), correctOption: 1 },
    { topicId: dataStructures.id, difficultyLevel: 1, content: "FIFO data structure?", options: JSON.stringify(["Queue", "Stack", "Graph", "Heap"]), correctOption: 0 },
    { topicId: dataStructures.id, difficultyLevel: 1, content: "A collection of items stored at contiguous memory locations?", options: JSON.stringify(["Linked List", "Array", "Tree", "Graph"]), correctOption: 1 },
    { topicId: dataStructures.id, difficultyLevel: 1, content: "Node containing data and a pointer?", options: JSON.stringify(["Array", "Stack", "Linked List", "Queue"]), correctOption: 2 },
    { topicId: dataStructures.id, difficultyLevel: 1, content: "Hierarchical data structure?", options: JSON.stringify(["Array", "Linked List", "Stack", "Tree"]), correctOption: 3 },
    // Level 2
    { topicId: dataStructures.id, difficultyLevel: 2, content: "Time complexity to access array element by index?", options: JSON.stringify(["O(1)", "O(n)", "O(log n)", "O(n^2)"]), correctOption: 0 },
    { topicId: dataStructures.id, difficultyLevel: 2, content: "What traversal visits Left, Root, Right?", options: JSON.stringify(["Pre-order", "In-order", "Post-order", "Level-order"]), correctOption: 1 },
    { topicId: dataStructures.id, difficultyLevel: 2, content: "Hash table uses what to compute index?", options: JSON.stringify(["Hash function", "Binary search", "Linear search", "Sorting"]), correctOption: 0 },
    { topicId: dataStructures.id, difficultyLevel: 2, content: "Max heap root element is always?", options: JSON.stringify(["Smallest", "Largest", "Median", "Random"]), correctOption: 1 },
    { topicId: dataStructures.id, difficultyLevel: 2, content: "Graph representation using matrix?", options: JSON.stringify(["Adjacency List", "Adjacency Matrix", "Edge List", "Incidence Matrix"]), correctOption: 1 },
    // Level 3
    { topicId: dataStructures.id, difficultyLevel: 3, content: "Worst case time complexity of QuickSort?", options: JSON.stringify(["O(n log n)", "O(n)", "O(n^2)", "O(log n)"]), correctOption: 2 },
    { topicId: dataStructures.id, difficultyLevel: 3, content: "AVL tree is what type of tree?", options: JSON.stringify(["Self-balancing BST", "Spanning tree", "B-tree", "Trie"]), correctOption: 0 },
    { topicId: dataStructures.id, difficultyLevel: 3, content: "Dijkstra's algorithm finds?", options: JSON.stringify(["MST", "Shortest path", "Max flow", "Topological sort"]), correctOption: 1 },
    { topicId: dataStructures.id, difficultyLevel: 3, content: "Which data structure for BFS?", options: JSON.stringify(["Stack", "Queue", "Priority Queue", "Heap"]), correctOption: 1 },
    { topicId: dataStructures.id, difficultyLevel: 3, content: "Time complexity of binary search?", options: JSON.stringify(["O(1)", "O(n)", "O(log n)", "O(n log n)"]), correctOption: 2 },

    // CS - Programming Basics
    // Level 1
    { topicId: programmingBasics.id, difficultyLevel: 1, content: "What is a bug?", options: JSON.stringify(["An insect", "An error in a program", "A feature", "A programming language"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 1, content: "Boolean variable values?", options: JSON.stringify(["1, 2, 3", "True, False", "A, B, C", "Positive, Negative"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 1, content: "What is an integer?", options: JSON.stringify(["A decimal number", "A whole number", "A character", "A boolean"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 1, content: "Which loop repeats until a condition is false?", options: JSON.stringify(["For loop", "While loop", "Switch case", "If statement"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 1, content: "What does HTML stand for?", options: JSON.stringify(["HyperText Markup Language", "HighText Machine Language", "HyperLoop Machine Language", "None"]), correctOption: 0 },
    // Level 2
    { topicId: programmingBasics.id, difficultyLevel: 2, content: "What is a variable?", options: JSON.stringify(["A fixed value", "A named storage location", "A function", "An error"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 2, content: "What does an 'if' statement do?", options: JSON.stringify(["Loops code", "Executes code conditionally", "Declares variable", "Defines function"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 2, content: "What is the modulo operator (%) used for?", options: JSON.stringify(["Multiplication", "Division", "Finding remainder", "Percentage"]), correctOption: 2 },
    { topicId: programmingBasics.id, difficultyLevel: 2, content: "Difference between = and == ?", options: JSON.stringify(["None", "= assigns, == compares", "= compares, == assigns", "Both are assignment"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 2, content: "What is a function?", options: JSON.stringify(["A variable", "A reusable block of code", "An array", "A syntax error"]), correctOption: 1 },
    // Level 3
    { topicId: programmingBasics.id, difficultyLevel: 3, content: "What is recursion?", options: JSON.stringify(["Looping construct", "A function calling itself", "Error handling", "Object oriented principle"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 3, content: "What is polymorphism?", options: JSON.stringify(["Many forms", "Data hiding", "Inheriting attributes", "Looping"]), correctOption: 0 },
    { topicId: programmingBasics.id, difficultyLevel: 3, content: "What is a pointer?", options: JSON.stringify(["A variable holding a memory address", "A function", "An array", "A boolean"]), correctOption: 0 },
    { topicId: programmingBasics.id, difficultyLevel: 3, content: "What does an API do?", options: JSON.stringify(["Designs UI", "Allows software components to communicate", "Compiles code", "Stores data"]), correctOption: 1 },
    { topicId: programmingBasics.id, difficultyLevel: 3, content: "What is a race condition?", options: JSON.stringify(["Fast execution", "Concurrent operations competing", "Syntax error", "Database timeout"]), correctOption: 1 },

    // English - Grammar
    // Level 1
    { topicId: grammar.id, difficultyLevel: 1, content: "What is a noun?", options: JSON.stringify(["Action word", "Describing word", "Person, place, or thing", "Joining word"]), correctOption: 2 },
    { topicId: grammar.id, difficultyLevel: 1, content: "What is a verb?", options: JSON.stringify(["Action word", "Noun", "Adjective", "Pronoun"]), correctOption: 0 },
    { topicId: grammar.id, difficultyLevel: 1, content: "Select the pronoun:", options: JSON.stringify(["Run", "Beautiful", "He", "Quickly"]), correctOption: 2 },
    { topicId: grammar.id, difficultyLevel: 1, content: "Which sentence is correct?", options: JSON.stringify(["I is happy.", "I am happy.", "I are happy.", "I be happy."]), correctOption: 1 },
    { topicId: grammar.id, difficultyLevel: 1, content: "Plural of 'cat'?", options: JSON.stringify(["cates", "cats", "caties", "cat's"]), correctOption: 1 },
    // Level 2
    { topicId: grammar.id, difficultyLevel: 2, content: "Identify the adjective: The quick brown fox", options: JSON.stringify(["The", "quick", "fox", "none"]), correctOption: 1 },
    { topicId: grammar.id, difficultyLevel: 2, content: "What is an adverb?", options: JSON.stringify(["Modifies a verb", "Names a person", "Joins sentences", "Shows emotion"]), correctOption: 0 },
    { topicId: grammar.id, difficultyLevel: 2, content: "Past tense of 'go'?", options: JSON.stringify(["goed", "gone", "went", "going"]), correctOption: 2 },
    { topicId: grammar.id, difficultyLevel: 2, content: "Which is a conjunction?", options: JSON.stringify(["And", "Quickly", "Happy", "House"]), correctOption: 0 },
    { topicId: grammar.id, difficultyLevel: 2, content: "Choose the correct preposition: The book is ___ the table.", options: JSON.stringify(["in", "on", "at", "by"]), correctOption: 1 },
    // Level 3
    { topicId: grammar.id, difficultyLevel: 3, content: "Identify the passive voice:", options: JSON.stringify(["She ate the apple.", "The apple was eaten by her.", "She is eating the apple.", "She will eat the apple."]), correctOption: 1 },
    { topicId: grammar.id, difficultyLevel: 3, content: "What is a gerund?", options: JSON.stringify(["A noun formed from a verb + ing", "A past participle", "An infinitive", "An adjective"]), correctOption: 0 },
    { topicId: grammar.id, difficultyLevel: 3, content: "Subjunctive mood example:", options: JSON.stringify(["I was there.", "If I were you...", "Are you there?", "Go away!"]), correctOption: 1 },
    { topicId: grammar.id, difficultyLevel: 3, content: "Identify the independent clause:", options: JSON.stringify(["Because it rained", "Although she smiled", "He ran fast", "When the bell rang"]), correctOption: 2 },
    { topicId: grammar.id, difficultyLevel: 3, content: "What is an appositive?", options: JSON.stringify(["A noun renaming another noun next to it", "A type of verb", "A prepositional phrase", "A conjunction"]), correctOption: 0 },

    // English - Vocabulary
    // Level 1
    { topicId: vocabulary.id, difficultyLevel: 1, content: "Synonym for 'happy'?", options: JSON.stringify(["Sad", "Joyful", "Angry", "Tired"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 1, content: "Antonym for 'hot'?", options: JSON.stringify(["Warm", "Boiling", "Cold", "Spicy"]), correctOption: 2 },
    { topicId: vocabulary.id, difficultyLevel: 1, content: "Meaning of 'huge'?", options: JSON.stringify(["Very small", "Very big", "Average", "Tiny"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 1, content: "Which is a color?", options: JSON.stringify(["Table", "Chair", "Blue", "Run"]), correctOption: 2 },
    { topicId: vocabulary.id, difficultyLevel: 1, content: "Synonym for 'fast'?", options: JSON.stringify(["Slow", "Quick", "Heavy", "Light"]), correctOption: 1 },
    // Level 2
    { topicId: vocabulary.id, difficultyLevel: 2, content: "Synonym for 'abundant'?", options: JSON.stringify(["Scarce", "Plentiful", "Empty", "Rare"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 2, content: "Antonym for 'generous'?", options: JSON.stringify(["Selfish", "Kind", "Giving", "Helpful"]), correctOption: 0 },
    { topicId: vocabulary.id, difficultyLevel: 2, content: "Meaning of 'predict'?", options: JSON.stringify(["To forget", "To guess what happens next", "To remember", "To lie"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 2, content: "What does 'visible' mean?", options: JSON.stringify(["Can be heard", "Can be seen", "Cannot be seen", "Can be tasted"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 2, content: "Synonym for 'courageous'?", options: JSON.stringify(["Fearful", "Brave", "Cowardly", "Shy"]), correctOption: 1 },
    // Level 3
    { topicId: vocabulary.id, difficultyLevel: 3, content: "Meaning of 'ephemeral'?", options: JSON.stringify(["Lasting a long time", "Short-lived", "Permanent", "Beautiful"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 3, content: "Synonym for 'ubiquitous'?", options: JSON.stringify(["Rare", "Omnipresent", "Hidden", "Expensive"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 3, content: "Antonym for 'mitigate'?", options: JSON.stringify(["Alleviate", "Aggravate", "Soothe", "Lessen"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 3, content: "Meaning of 'esoteric'?", options: JSON.stringify(["Common", "Obscure or understood by few", "Clear", "Loud"]), correctOption: 1 },
    { topicId: vocabulary.id, difficultyLevel: 3, content: "Synonym for 'sycophant'?", options: JSON.stringify(["Leader", "Flatterer", "Rebel", "Genius"]), correctOption: 1 }
  ];

  await prisma.question.createMany({
    data: questionsData
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
