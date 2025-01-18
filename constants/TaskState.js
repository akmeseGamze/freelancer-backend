class TaskState {
    static todo = 'todo';
    static in_progress = 'in_progress';
    static done = 'done';

    static values() {
        return [
            this.todo,
            this.in_progress,
            this.done
        ];
    }
}

module.exports = TaskState;