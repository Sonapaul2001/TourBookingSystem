const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.loginUser = async (req, res) => {
    try {
        console.log("Login request received", req.body);  // Debugging
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
const Task = require('../models/Task');
const getTasks = async (req, res) => {
try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
}catch (error){
    res.status(500).json({ message: error.message });
}
};

const addTask = async (req, res) => {
    const { title, description, deadline } = req.body;
    try {
    const task = await Task.create({ userId: req.user.id, title, description, deadline });
    res.status(201).json(task);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { title, description, completed, deadline } = req.body;
    try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed ?? task.completed;
    task.deadline = deadline || task.deadline;
    const updatedTask = await task.save();
    res.json(updatedTask);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};
    
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await task.remove();
        res.json({ message: 'Task deleted' });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
        };
        module.exports = { getTasks, addTask, updateTask, deleteTask };