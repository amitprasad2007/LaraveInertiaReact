export const formatMessageDateLong = (date) =>{
    const now =new Date();
    const inputDate = new Date(date);

    if(isToday(inputDate)){
        return inputDate.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit",
        });
    }else if(isYesterday(inputDate)){
        return (
            "Yesterday"+
            inputDate.toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit",
            })
        );
    }else if(inputDate.getFullYear()===now.getFullYear()){
        return inputDate.toLocaleDateString([],{
            day:"2-digit",
            month:"2-digit",
        });
    }else {
        return inputDate.toLocaleDateString();
    }
};

export const formatMessageDateShort = (date)=>{
    const now =new Date();
    const inputDate = new Date(date);

    if(isToday(inputDate)){
        return inputDate.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit",
        });
    }else if(isYesterday(inputDate)){
        return "Yesterday";
    } else if(inputDate.getFullYear()===now.getFullYear()){
        return inputDate.toLocaleDateString([],{
            day:"2-digit",
            month:"2-digit",
        });
    }else {
        return inputDate.toLocaleDateString();
    }

};
