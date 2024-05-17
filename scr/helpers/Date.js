class HelpDate {
    thisweek = (date) =>{
        if (date.getDay() != 0) {
            var start = date.getTime() + (1 - date.getDay()) * (1000 * 60 * 60 * 24)
            var end = start + 6 * (1000 * 60 * 60 * 24)
        } else {
            var end = date.getTime()
            var start = date.getTime() - 6 * (1000 * 60 * 60 * 24)
        }
        return [new Date(start),new Date(end)]
        console.log("Tuần-----------------");
        console.log(new Date(start));
        console.log(new Date(end));
    }

    thismonth = (date) =>{
        return [new Date(date.getFullYear(),(date.getMonth()), 1), new Date(date.getFullYear(),(date.getMonth()+1), 0)]
        console.log("Tháng-----------------");
        console.log(new Date(date.getFullYear(),(date.getMonth()), 2));
        console.log(new Date(date.getFullYear(),(date.getMonth()+1), 1));
    
    }

    thisquy = (date) =>{
        var start = date.getFullYear() + '-'+ (((Math.floor(((date.getMonth() + 1) - 1) / 3) + 1) - 1) * 3 + 1) + '-' + 1
        var end = date.getFullYear() + '-' + ((((Math.floor(((date.getMonth() + 1) - 1) / 3) + 1) - 1) * 3 + 3)) + '-' + 30
        return [new Date(start),new Date(date.getFullYear(), (((((Math.floor(((date.getMonth() + 1) - 1) / 3) + 1) - 1) * 3 + 3)) ), 0)]
    
        console.log("Quý-----------------");
        console.log(new Date(start));
        console.log(new Date(end));
    }

    thisyear = (date) =>{
        var start = date.getFullYear() + '-'+ 1 +'-' + 1
        var end = date.getFullYear() + '-' + 12 + '-' + 31
        return [new Date(start),new Date(end)]
    
        console.log("Năm-----------------");
        console.log(new Date(start));
        console.log(new Date(end));
    }
    
    getDate(time){
        if ((new Date(time)).getDate() <= 9) {
            return(0+''+(new Date(time)).getDate())    
        }
        return((new Date(time)).getDate())
    }

    getDay(time){
        if ((new Date(time)).getDay() == 0) {
            return "Chủ nhật"   
        }
        return "Thứ " + ((new Date(time)).getDay() + 1)
    }

    getMonthYear(time, mode){
        if (mode == 'sort') {
            return ((new Date(time)).getMonth() + 1) + "/" + ((new Date(time)).getFullYear())
        }
        return "Tháng " + ((new Date(time)).getMonth() + 1) + " " + ((new Date(time)).getFullYear())
    }

    checkMonthYear(inputString) {
        const [inputMonth, inputYear] = inputString.split('/').map(Number);
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
    
        if (inputYear === currentYear) {
            if (inputMonth === currentMonth) {
                return 'Tháng này';
            } else if (inputMonth === currentMonth - 1) {
                return 'Tháng trước';
            }
        }
        return inputString;
    }

    getDayMonth(time){
        return ((new Date(time)).getDate())+ "/" + ((new Date(time)).getMonth() + 1)
    }
    
    getRangeDate(start, end) {
        return Math.floor((new Date(convertFirstDay(end)) - new Date(convertFirstDay(start))) / (1000 * 60 * 60 * 24))
    }

    isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    getTitle (date1, date2){
        let current = new Date()
        if (this.isSameDate(new Date(this.convertFirstDay(date1)),new Date(this.convertFirstDay(this.thisweek(current)[0]))) &&
            this.isSameDate(new Date(this.convertFirstDay(date2)),new Date(this.convertFirstDay(this.thisweek(current)[1])))) {
            return "Tuần này"
        }
        if (this.isSameDate(new Date(this.convertFirstDay(date1)),new Date(this.convertFirstDay(this.thismonth(current)[0]))) &&
            this.isSameDate(new Date(this.convertFirstDay(date2)),new Date(this.convertFirstDay(this.thismonth(current)[1])))) {
            return "Tháng này"
        }
        if (this.isSameDate(new Date(this.convertFirstDay(date1)),new Date(this.convertFirstDay(this.thisquy(current)[0]))) &&
            this.isSameDate(new Date(this.convertFirstDay(date2)),new Date(this.convertFirstDay(this.thisquy(current)[1])))) {
            return "Quý này"
        }
        if (this.isSameDate(new Date(this.convertFirstDay(date1)),new Date(this.convertFirstDay(this.thisyear(current)[0]))) &&
            this.isSameDate(new Date(this.convertFirstDay(date2)),new Date(this.convertFirstDay(this.thisyear(current)[1])))) {
            return "Năm này"
        }
        else{
            return this.getDayMonth(date1) + ' - ' + this.getDayMonth(this.convertFirstDay(date2))
        }
    }
    getStartAndEndDatesOfPastFourMonths(numbermonth) {
        const today = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');
        const result = [];
    
        for (let i = 0; i <= numbermonth; i++) {
            const tempDate = new Date(today);
            tempDate.setMonth(today.getMonth() - i);
    
            const year = tempDate.getFullYear();
            const month = tempDate.getMonth();
            const startOfMonth = new Date((new Date(year, month, 2).toISOString().split('T')[0] + 'T00:00:00.000Z'));
    
            const endOfMonth = (new Date(new Date(year, month + 1, 1)).toISOString().split('T')[0] + 'T00:00:00.000Z');
            result.push([startOfMonth, endOfMonth]);
    
            result.sort((a, b) => a[0] - b[0]);
        }
    
        return result;    
    }
    splitMonth(year, month) {
        let timePeriods = [];
        let daysInMonth = new Date(year, month, 0).getDate();
        const periodsLength = [7, 7, 8, daysInMonth - 22];
        let startDate = new Date(year, month - 1, 1);
        
        for (let length of periodsLength) {
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + length - 1);
            
            timePeriods.push(`${this.getDayMonth(startDate)} - ${this.getDayMonth(endDate)}`);
            
            startDate.setDate(endDate.getDate() + 1);
        }
    
        return timePeriods;
    }

    splitMonthobj(year, month) {
        let timePeriods = [];
        let daysInMonth = new Date(year, month, 0).getDate();
        const periodsLength = [7, 7, 8, daysInMonth - 22];
        let startDate = new Date((new Date(year, month-1, 2).toISOString().split('T')[0] + 'T00:00:00.000Z'));
        
        periodsLength.forEach(length => {
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + length);
            let list = [new Date(startDate), new Date(endDate-1)]
            timePeriods.push(list);
            
            startDate.setDate(endDate.getDate());
        });
    
        return timePeriods;
    }

    convertFirstDay(time) {
        return time.toISOString().split('T')[0] + 'T00:00:00.000Z'
    }
    
    convertEndDay(time) {
        return time.toISOString().split('T')[0] + 'T23:59:00.000Z'
    }
}


module.exports = new HelpDate;