import Task from '../model/taskModel.js';

// ✅ Add Task
export const addTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        // console.log(title);
        // console.log(description);
        // console.log(req);
        if (!title) return res.status(400).json({ message: "Title is required" });

        const newTask = new Task({ user: req.user._id, title, description });
        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error adding task" });
    }
};

// ✅ Get All Tasks for Logged-in User
export const getTasks = async (req, res) => {
    // console.log(req.user._id);
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
};

// ✅ Update Task
export const updateTask = async (req, res) => {
    // console.log("try updating");
    try {
        const { title, description} = req.body;
        const task = await Task.findById(req.params.id);
        // console.log("updated title:", title);
        if (!task || task.user.toString() !== req.user._id) {
            return res.status(404).json({ message: "Task not found" });
        }
        // console.log("error");
        task.title = title || task.title;
        task.description = description || task.description;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
    try {
        console.log("try delete");
        const task = await Task.findById(req.params.id);
        console.log(req.params.id);
        if (!task || task.user.toString() !== req.user._id) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        console.log("deleted successfully");
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task" });
    }
};
