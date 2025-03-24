export const toKMBT = (val: number): string => {
        
    if (val >= 1_000_000_000_000) {

        // 조 (Trillion)
        return parseFloat((val / 1_000_000_000_000).toFixed(2)) + 'T'; 

    } else if (val >= 1_000_000_000) {
        
        // 십억 (Billion)
        return parseFloat((val / 1_000_000_000).toFixed(2)) + 'B'; 

    } else if (val >= 1_000_000) {
        
        //  백만 (Million)
        return parseFloat((val / 1_000_000).toFixed(2)) + 'M';

    } else if (val >= 1_000) {
        
        // 천 (Thousand)
        return parseFloat((val / 1_000).toFixed(2)) + 'K'; 

    } else {
        
        return parseFloat(val.toFixed(2)).toString();
    }
}

export const setTimestamp = (date: number): string => {

    const dateStp = new Date(date);

    const year  = dateStp.getFullYear();
    const month = String(dateStp.getMonth() + 1).padStart(2, '0');
    const day   = String(dateStp.getDate()).padStart(2, '0');
    const hours = String(dateStp.getHours()).padEnd(2, '0');
    const min   = String(dateStp.getMinutes()).padEnd(2, '0');

    return `${year}.${month}.${day} ${hours}:${min}`;
}