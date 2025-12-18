import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const MySQLJoinsAnimated = () => {
  const [currentJoin, setCurrentJoin] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const joins = [
    {
      name: "INNER JOIN",
      definition: "Returns only the rows that have matching values in BOTH tables",
      realLife: "Like finding students who are ENROLLED in classes - we only see students who actually have classes",
      
      leftTableName: "Students",
      leftColumns: ["student_id", "student_name", "email"],
      leftData: [
        { student_id: 1, student_name: "Sara", email: "sara@school.com", match: true },
        { student_id: 2, student_name: "Yalini", email: "yalini@school.com", match: true },
        { student_id: 3, student_name: "Anand", email: "anand@school.com", match: false },
        { student_id: 4, student_name: "Meera", email: "meera@school.com", match: false }
      ],
      
      rightTableName: "Enrollments",
      rightColumns: ["enrollment_id", "student_id", "course"],
      rightData: [
        { enrollment_id: 101, student_id: 1, course: "Math", match: true },
        { enrollment_id: 102, student_id: 2, course: "Science", match: true },
        { enrollment_id: 103, student_id: 1, course: "History", match: true }
      ],
      
      resultColumns: ["student_name", "email", "course"],
      resultData: [
        { student_name: "Sara", email: "sara@school.com", course: "Math" },
        { student_name: "Sara", email: "sara@school.com", course: "History" },
        { student_name: "Yalini", email: "yalini@school.com", course: "Science" }
      ],
      
      sql: `SELECT students.student_name, students.email, enrollments.course
FROM students
INNER JOIN enrollments 
ON students.student_id = enrollments.student_id;`,
      
      explanation: "Only Sara and Yalini appear because they have enrollments. Anand and Meera are excluded."
    },
    
    {
      name: "LEFT JOIN (LEFT OUTER JOIN)",
      definition: "Returns ALL rows from the LEFT table, and matching rows from the RIGHT table",
      realLife: "Like a customer list showing ALL customers and their orders - customers without orders still appear with NULL",
      
      leftTableName: "Customers",
      leftColumns: ["customer_id", "customer_name", "phone"],
      leftData: [
        { customer_id: 1, customer_name: "Vishnu", phone: "9876543210", match: true },
        { customer_id: 2, customer_name: "Kavi", phone: "8765432109", match: false },
        { customer_id: 3, customer_name: "Priya", phone: "7654321098", match: true }
      ],
      
      rightTableName: "Orders",
      rightColumns: ["order_id", "customer_id", "product"],
      rightData: [
        { order_id: 201, customer_id: 1, product: "Laptop", match: true },
        { order_id: 202, customer_id: 3, product: "Mouse", match: true }
      ],
      
      resultColumns: ["customer_name", "phone", "product"],
      resultData: [
        { customer_name: "Vishnu", phone: "9876543210", product: "Laptop" },
        { customer_name: "Kavi", phone: "8765432109", product: "NULL" },
        { customer_name: "Priya", phone: "7654321098", product: "Mouse" }
      ],
      
      sql: `SELECT customers.customer_name, customers.phone, orders.product
FROM customers
LEFT JOIN orders 
ON customers.customer_id = orders.customer_id;`,
      
      explanation: "ALL customers shown. Kavi has no orders, so product is NULL."
    },
    
    {
      name: "RIGHT JOIN (RIGHT OUTER JOIN)",
      definition: "Returns ALL rows from the RIGHT table, and matching rows from the LEFT table",
      realLife: "Like showing ALL reviews even if the product was deleted - the review stays with NULL for product info",
      
      leftTableName: "Products",
      leftColumns: ["product_id", "product_name", "price"],
      leftData: [
        { product_id: 1, product_name: "Phone", price: "$699", match: true },
        { product_id: 2, product_name: "Tablet", price: "$499", match: true }
      ],
      
      rightTableName: "Reviews",
      rightColumns: ["review_id", "product_id", "rating"],
      rightData: [
        { review_id: 301, product_id: 1, rating: "⭐⭐⭐⭐⭐", match: true },
        { review_id: 302, product_id: 2, rating: "⭐⭐⭐⭐", match: true },
        { review_id: 303, product_id: 3, rating: "⭐⭐⭐", match: false }
      ],
      
      resultColumns: ["product_name", "price", "rating"],
      resultData: [
        { product_name: "Phone", price: "$699", rating: "⭐⭐⭐⭐⭐" },
        { product_name: "Tablet", price: "$499", rating: "⭐⭐⭐⭐" },
        { product_name: "NULL", price: "NULL", rating: "⭐⭐⭐" }
      ],
      
      sql: `SELECT products.product_name, products.price, reviews.rating
FROM products
RIGHT JOIN reviews 
ON products.product_id = reviews.product_id;`,
      
      explanation: "ALL reviews shown. The 3rd review's product no longer exists, so it's NULL."
    },
    
    {
      name: "FULL OUTER JOIN",
      definition: "Returns ALL rows when there is a match in EITHER left OR right table",
      realLife: "Like merging employee and department lists - show everyone and all departments, even if unmatched",
      
      leftTableName: "Employees",
      leftColumns: ["emp_id", "emp_name", "dept_id"],
      leftData: [
        { emp_id: 1, emp_name: "Masood", dept_id: 10, match: true },
        { emp_id: 2, emp_name: "Raja", dept_id: 20, match: true },
        { emp_id: 3, emp_name: "Suruthi", dept_id: null, match: false }
      ],
      
      rightTableName: "Departments",
      rightColumns: ["dept_id", "dept_name"],
      rightData: [
        { dept_id: 10, dept_name: "Sales", match: true },
        { dept_id: 20, dept_name: "IT", match: true },
        { dept_id: 30, dept_name: "HR", match: false }
      ],
      
      resultColumns: ["emp_name", "dept_name"],
      resultData: [
        { emp_name: "Masood", dept_name: "Sales" },
        { emp_name: "Raja", dept_name: "IT" },
        { emp_name: "Suruthi", dept_name: "NULL" },
        { emp_name: "NULL", dept_name: "HR" }
      ],
      
      sql: `SELECT employees.emp_name, departments.dept_name
FROM employees
FULL OUTER JOIN departments 
ON employees.dept_id = departments.dept_id;

-- MySQL doesn't support FULL OUTER JOIN directly
-- Use this instead:
SELECT employees.emp_name, departments.dept_name
FROM employees LEFT JOIN departments 
ON employees.dept_id = departments.dept_id
UNION
SELECT employees.emp_name, departments.dept_name
FROM employees RIGHT JOIN departments 
ON employees.dept_id = departments.dept_id;`,
      
      explanation: "Shows ALL employees and ALL departments. Suruthi has no dept. HR has no employees."
    },
    
    {
      name: "CROSS JOIN",
      definition: "Returns the Cartesian product - EVERY row from the first table with EVERY row from the second",
      realLife: "Like creating all possible shirt combinations: every size with every color",
      
      leftTableName: "Sizes",
      leftColumns: ["size_id", "size_name"],
      leftData: [
        { size_id: 1, size_name: "Small", match: true },
        { size_id: 2, size_name: "Medium", match: true },
        { size_id: 3, size_name: "Large", match: true }
      ],
      
      rightTableName: "Colors",
      rightColumns: ["color_id", "color_name"],
      rightData: [
        { color_id: 1, color_name: "Red", match: true },
        { color_id: 2, color_name: "Blue", match: true }
      ],
      
      resultColumns: ["size_name", "color_name"],
      resultData: [
        { size_name: "Small", color_name: "Red" },
        { size_name: "Small", color_name: "Blue" },
        { size_name: "Medium", color_name: "Red" },
        { size_name: "Medium", color_name: "Blue" },
        { size_name: "Large", color_name: "Red" },
        { size_name: "Large", color_name: "Blue" }
      ],
      
      sql: `SELECT sizes.size_name, colors.color_name
FROM sizes
CROSS JOIN colors;

-- Alternative syntax:
SELECT sizes.size_name, colors.color_name
FROM sizes, colors;`,
      
      explanation: "3 sizes × 2 colors = 6 combinations. Every size paired with every color."
    },
    
    {
      name: "SELF JOIN",
      definition: "A table is joined with ITSELF to compare rows within the same table",
      realLife: "Like an employee table showing each employee with their supervisor (who is also an employee)",
      
      leftTableName: "Employees",
      leftColumns: ["emp_id", "emp_name", "supervisor_id"],
      leftData: [
        { emp_id: 1, emp_name: "Sara", manager_id: null, match: false },
        { emp_id: 2, emp_name: "Meera", manager_id: 1, match: true },
        { emp_id: 3, emp_name: "Anand", manager_id: 2, match: true },
        { emp_id: 4, emp_name: "Yalini", manager_id: 2, match: true }
      ],
      
      rightTableName: "Employees (as Supervisors)",
      rightColumns: ["emp_id", "emp_name"],
      rightData: [
        { emp_id: 1, emp_name: "Sara", match: true },
        { emp_id: 2, emp_name: "Meera", match: true }
      ],
      
      resultColumns: ["employee", "supervisor"],
      resultData: [
        { employee: "Meera", supervisor: "Sara" },
        { employee: "Anand", supervisor: "Meera" },
        { employee: "Yalini", supervisor: "Meera" }
      ],
      
      sql: `SELECT 
    e.emp_name AS employee,
    s.emp_name AS supervisor
FROM employees e
INNER JOIN employees s
ON e.supervisor_id = s.emp_id;`,
      
      explanation: "Same table used twice! Employee's supervisor_id matches another employee's emp_id."
    },
    
    {
      name: "UNION",
      definition: "Combines results from two queries and removes DUPLICATE rows",
      realLife: "Like merging customer lists from website and app - same person appears only once",
      
      leftTableName: "Website_Users",
      leftColumns: ["user_id", "username"],
      leftData: [
        { user_id: 1, username: "vishnu_k", match: true },
        { user_id: 2, username: "priya_raj", match: true },
        { user_id: 3, username: "kavi_m", match: true }
      ],
      
      rightTableName: "Mobile_Users",
      rightColumns: ["user_id", "username"],
      rightData: [
        { user_id: 1, username: "priya_raj", match: true },
        { user_id: 2, username: "masood_a", match: true },
        { user_id: 3, username: "kavi_m", match: true }
      ],
      
      resultColumns: ["username", "source"],
      resultData: [
        { username: "vishnu_k", source: "Website" },
        { username: "priya_raj", source: "Both" },
        { username: "kavi_m", source: "Both" },
        { username: "masood_a", source: "Mobile" }
      ],
      
      sql: `SELECT username FROM website_users
UNION
SELECT username FROM mobile_users;

-- Result: 4 unique users
-- bob456 and carol789 appear only once`,
      
      explanation: "Duplicates removed! priya_raj and kavi_m appear only once even though they're in both tables."
    },
    
    {
      name: "UNION ALL",
      definition: "Combines results from two queries and KEEPS all DUPLICATE rows",
      realLife: "Like combining morning and evening sales - we need all records to calculate total revenue",
      
      leftTableName: "Morning_Sales",
      leftColumns: ["sale_id", "item", "amount"],
      leftData: [
        { sale_id: 1, item: "Coffee", amount: "$150", match: true },
        { sale_id: 2, item: "Bagel", amount: "$90", match: true }
      ],
      
      rightTableName: "Evening_Sales",
      rightColumns: ["sale_id", "item", "amount"],
      rightData: [
        { sale_id: 1, item: "Coffee", amount: "$200", match: true },
        { sale_id: 2, item: "Pizza", amount: "$300", match: true }
      ],
      
      resultColumns: ["item", "amount", "shift"],
      resultData: [
        { item: "Coffee", amount: "$150", shift: "Morning" },
        { item: "Bagel", amount: "$90", shift: "Morning" },
        { item: "Coffee", amount: "$200", shift: "Evening" },
        { item: "Pizza", amount: "$300", shift: "Evening" }
      ],
      
      sql: `SELECT item, amount, 'Morning' AS shift 
FROM morning_sales
UNION ALL
SELECT item, amount, 'Evening' AS shift 
FROM evening_sales;

-- Result: All 4 rows kept
-- Coffee appears twice (once per shift)`,
      
      explanation: "Keeps duplicates! Coffee appears twice because we need both sales records for accurate totals."
    }
  ];

  const current = joins[currentJoin];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (animationStep >= 5) {
      setAnimationStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAnimationStep(0);
  };

  const handleNext = () => {
    setCurrentJoin((prev) => (prev + 1) % joins.length);
    handleReset();
  };

  const handlePrev = () => {
    setCurrentJoin((prev) => (prev - 1 + joins.length) % joins.length);
    handleReset();
  };

  const DataTable = ({ title, columns, data, isResult = false }) => (
    <div className={`${isResult ? 'col-span-2' : ''}`}>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-t-lg font-bold text-center">
        {title}
      </div>
      <div className="bg-white border-2 border-indigo-200 rounded-b-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b-2 border-indigo-200">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-4 py-3 text-sm border-b border-gray-200 ${
                    row[col] === 'NULL' ? 'text-red-500 italic font-semibold' : 'text-gray-800'
                  }`}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-3xl shadow-2xl p-8 mb-1">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            MySQL JOINS Complete Guide
          </h1>
          <p className="text-center text-gray-600 text-xl">Simple Definitions • Real Examples • Visual Animations</p>
        </div>

        {/* Navigation */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:scale-105 transition shadow-lg"
          >
            <ChevronLeft size={24} />
            Previous
          </button>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold">{current.name}</h2>
            <p className="text-indigo-100">{currentJoin + 1} of {joins.length}</p>
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:scale-105 transition shadow-lg"
          >
            Next
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          
          {/* Section 1: Definition */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-2xl font-bold">📖 Definition</h3>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-b-lg p-6">
              <p className="text-xl text-gray-800 font-medium leading-relaxed">{current.definition}</p>
            </div>
          </div>

          {/* Section 2: Real Life Example */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-2xl font-bold">🌍 Real-Life Example</h3>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-b-lg p-6">
              <p className="text-xl text-gray-800 font-medium leading-relaxed">{current.realLife}</p>
            </div>
          </div>

          {/* Section 3: Tables */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg mb-4">
              <h3 className="text-2xl font-bold">📊 Tables</h3>
            </div>
            <div className={`grid ${current.name.includes('UNION') ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
              <DataTable 
                title={current.leftTableName}
                columns={current.leftColumns}
                data={current.leftData}
              />
              <DataTable 
                title={current.rightTableName}
                columns={current.rightColumns}
                data={current.rightData}
              />
            </div>
          </div>

          {/* Section 4: Animation */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg mb-4">
              <h3 className="text-2xl font-bold">🎬 Animation: Watch the JOIN in Action</h3>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-8">
              {/* Progress Dots */}
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      step <= animationStep 
                        ? 'bg-orange-600 scale-125 shadow-lg' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Animation Steps */}
              <div className="text-center mb-6">
                <div className="inline-block bg-white px-6 py-3 rounded-full shadow-lg">
                  <span className="font-bold text-lg text-gray-800">
                    {animationStep === 0 && "Ready to Start"}
                    {animationStep === 1 && "⚡ Loading Left Table..."}
                    {animationStep === 2 && "⚡ Loading Right Table..."}
                    {animationStep === 3 && "🔍 Finding Matches..."}
                    {animationStep === 4 && "🔗 Joining Data..."}
                    {animationStep === 5 && "✅ Result Created!"}
                  </span>
                </div>
              </div>

              {/* Animated Visual */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 min-h-48">
                {/* Left Table Icon */}
                <div className={`transition-all duration-700 ${
                  animationStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}>
                  <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-6xl shadow-2xl ${
                    animationStep >= 3 ? 'bg-gradient-to-br from-blue-400 to-blue-600 scale-110' : 'bg-gradient-to-br from-blue-300 to-blue-500'
                  }`}>
                    📋
                  </div>
                  <p className="text-center mt-2 font-bold text-gray-700">Left Table</p>
                </div>

                {/* Join Symbol */}
                <div className={`transition-all duration-700 ${
                  animationStep >= 4 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-180'
                }`}>
                  <div className="text-8xl">
                    {current.name.includes('UNION') ? '⬇️' : '🔗'}
                  </div>
                  <p className="text-center mt-2 font-bold text-orange-600">{current.name}</p>
                </div>

                {/* Right Table Icon */}
                <div className={`transition-all duration-700 ${
                  animationStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}>
                  <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-6xl shadow-2xl ${
                    animationStep >= 3 ? 'bg-gradient-to-br from-green-400 to-green-600 scale-110' : 'bg-gradient-to-br from-green-300 to-green-500'
                  }`}>
                    📋
                  </div>
                  <p className="text-center mt-2 font-bold text-gray-700">Right Table</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  {isPlaying ? 'Pause' : animationStep >= 5 ? 'Replay' : 'Play'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  <RotateCcw size={24} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Result */}
          <div className={`mb-8 transition-all duration-700 ${animationStep >= 5 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg mb-4">
              <h3 className="text-2xl font-bold">✨ Result After JOIN</h3>
            </div>
            <div className="grid grid-cols-1">
              <DataTable 
                title="Result Table"
                columns={current.resultColumns}
                data={current.resultData}
                isResult={true}
              />
            </div>
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <p className="text-lg text-gray-800 font-medium">
                <span className="font-bold text-yellow-700">💡 Explanation: </span>
                {current.explanation}
              </p>
            </div>
          </div>

          {/* Section 6: SQL Query */}
          <div className={`transition-all duration-700 ${animationStep >= 5 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-2xl font-bold">💻 SQL Query</h3>
            </div>
            <div className="bg-gray-900 text-green-400 p-6 rounded-b-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{current.sql}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySQLJoinsAnimated;