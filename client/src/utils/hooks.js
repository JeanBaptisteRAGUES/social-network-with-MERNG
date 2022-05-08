import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChange = (evt) => {
        setValues({...values, [evt.target.name]: evt.target.value});
    };

    const onSubmit = evt => {
        evt.preventDefault();
        callback();
        /* try{
            callback();
        }catch(err){
            if(err.message) console.log(err.message);
            if(!err.message) console.log(JSON.stringify(err));
        } */
    }

    return {
        onChange,
        onSubmit,
        values
    };
}