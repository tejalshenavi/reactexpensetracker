import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import classes from './Expenses.module.css';
import { themeActions } from '../../components/store/themeSlice';

const Expenses = () => {
    const [expenseList, setExpenseList] = useState([]);
    const [showExpenses, setShowExpenses] = useState(false);
    const [editableExpense, setEditableExpense] = useState(null);
    const amountInputref = useRef();
    const descriptionInputRef = useRef();
    const categoryInputRef = useRef();
    const dispatch = useDispatch();
    let changeTheme = useSelector(state => state.theme.darkTheme)

    const email = localStorage.getItem('email');

    const onClickHandler = async (event) => {
        event.preventDefault();
        const enteredAmount = amountInputref.current.value;
        const enteredDescription = descriptionInputRef.current.value;
        const enteredCategory = categoryInputRef.current.value;
        const expenses = {
            amount: enteredAmount,
            description: enteredDescription,
            category: enteredCategory,
        }
        if (editableExpense) {
            const id = editableExpense.id;
            try {
                await axios.put(`https://expensetracker-4164a-default-rtdb.firebaseio.com/${email}/${id}.json`, expenses)
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const response = await axios.post(`https://expensetracker-4164a-default-rtdb.firebaseio.com/${email}.json`, expenses)
                const idToken = response.data.name;
                const addExpense = { id: idToken, ...expenses }
                setExpenseList([...expenseList, addExpense])
            } catch (err) {
                console.log(err);
            }
        }
        amountInputref.current.value = '';
        descriptionInputRef.current.value = '';
        setShowExpenses(true);
        setEditableExpense(null);
    }

    useEffect(() => {
        try {
            const fetchExpense = async () => {
                const response = await axios.get(
                    `https://expensetracker-4164a-default-rtdb.firebaseio.com/${email}.json`
                )
                const data = response.data;
                const newExpenseArray = [];
                for (let key in data) {
                    newExpenseArray.push({ id: key, ...data[key] })
                }
                setShowExpenses(true);
                if (newExpenseArray.length === 0) {
                    setShowExpenses(false);
                }
                setExpenseList([...newExpenseArray]);
            }
            fetchExpense();
        } catch (err) {
            console.log(err);
        }
    }, [editableExpense, email])

    const deleteExpenseHandler = async (expense) => {
        const id = expense.id;
        try {
            await axios.delete(
                `https://expensetracker-4164a-default-rtdb.firebaseio.com/${email}/${id}.json`
            )
        } catch (err) {
            console.log(err);
        }
        setExpenseList(expenseList.filter((data) => data.id !== expense.id))
        if (expenseList.length === 1) {
            setShowExpenses(false);
        }
        console.log("Expense is succefully deleted")
    }

    const editExpenseHandler = (expense) => {
        amountInputref.current.value = expense.amount;
        descriptionInputRef.current.value = expense.description;
        categoryInputRef.current.value = expense.category;
        setEditableExpense(expense);
    }

    const totalAmount = expenseList.reduce((curr, acc) => {
        return curr + parseInt(acc.amount)
    }, 0)

    const addedExpenses = (
        expenseList.map((exp) => (
            <li key={Math.random()}>
                <div className={classes.amount}>
                    {exp.amount}
                </div>
                <div className={classes.description}>
                    {exp.description}
                </div>
                <div className={classes.category}>
                    {exp.category}
                </div>
                <div className={classes.delete}>
                    <button onClick={() => deleteExpenseHandler(exp)}>Delete</button>
                </div>
                <div className={classes.edit}>
                    <button onClick={() => editExpenseHandler(exp)}>Edit</button>
                </div>
            </li>
        ))
    )

    useEffect(() => {
        if (totalAmount < 10000) {
            dispatch(themeActions.toggleTheme({ value: false }))
        }
        if (totalAmount >= 10000 && changeTheme) {
            dispatch(themeActions.toggleTheme({ value: true }))
        }
    }, [dispatch, totalAmount, changeTheme])

    const activatePremiumHandler = () => {
        if (!changeTheme) {
            dispatch(themeActions.toggleTheme({ value: true }));
        } else {
            dispatch(themeActions.toggleTheme({ value: false }));
        }
    }

    const downloadFileHandler = () => {
        const CSVdata = expenseList.map((data) => `${data.amount},${data.category},${data.description}\n`).join('');
        const blob = new Blob([CSVdata], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
    }

    return (
        <div className={classes[changeTheme ? 'dark-theme' : '']}>
            <section className={classes[changeTheme ? 'expense-form-dark' : 'expense-form']}>
                <header>Add Expenses</header>
                <form>
                    <div className={classes.expense}>
                        <label htmlFor='amount'>Amount</label>
                        <input type='number' id='amount' ref={amountInputref} required />
                    </div>
                    <div className={classes.expense}>
                        <label htmlFor='description'>Description</label>
                        <input type='text' id='description' ref={descriptionInputRef} required />
                    </div>
                    <div className={classes.expense}>
                        <label htmlFor='category'>Category</label>
                        <select id='category' ref={categoryInputRef}>
                            <option value="food">Food</option>
                            <option value="shopping">Shopping</option>
                            <option value="fuel">Fuel</option>
                            <option value="movie">Movie</option>
                            <option value="travelling">Travelling</option>
                        </select>
                    </div>
                    <button onClick={onClickHandler}>Add</button>
                </form>
            </section>
            {showExpenses && <div className={classes['added-expenses']}>
                <div className={classes['expense-heading']}><div>Amount</div><div>Description</div> <div>Category</div></div>
                <ul>
                    {addedExpenses}
                </ul>
                <div className={classes.total}>
                    Total Amount = {totalAmount} /-
                </div>
            </div>}
            {totalAmount >= 10000 && <div className={classes.actions}>
                <button onClick={activatePremiumHandler}>
                    {changeTheme ? "Disable Premium" : "Activate Premium"}
                </button>
                {changeTheme && <button onClick={downloadFileHandler}>Download File</button>}
            </div>}

        </div>
    )
}

export default Expenses;