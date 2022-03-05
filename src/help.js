export default class CommonHelp {

        formatDateFromString = (str) => {
            return this.formatDate(new Date(str));
        }
        
        formatDate = (date) => {
            return [this.shiftZero(date.getDate()), this.shiftZero((date.getMonth() + 1)), date.getFullYear()].join('.') + ' ' + this.shiftZero(date.getHours()) + ':' + this.shiftZero(date.getMinutes());
        }

        shiftZero = (num, needLen) => {
            needLen = needLen || 2;
            let sNum = num + '', cQuan = sNum.length;

            for (let i = cQuan; i < needLen; i ++) sNum = '0' + sNum;
            return sNum;
        }

        matchStatus = (str) => {
            return this.matchStatusDictionary[str] === undefined ? str : this.matchStatusDictionary[str];
        }

        matchStatusDictionary = {
            SCHEDULED: "Запланирован",
            LIVE: "В прямом эфире",
            IN_PLAY: "В игре",
            PAUSED: "Пауза",
            FINISHED: "Завершен",
            POSTPONED: "Отложен",
            SUSPENDED: "Приостановлен",
            CANCELED: "Отменен"
        }
        
        parseGetParams = () => {
            var search = window.location.search.split('?')[1],
                params = {};
            
            if ( search === undefined || search === '' ) return params;
            
            search = search.split('&');
            
            for ( var i = 0; i < search.length; i ++ ) {
                let prs = search[i].split('=');
                params[ prs[0] ] = prs[1];
            }
            
            return params;
        }

        onlyUnique = (value, index, self) => { return self.indexOf(value) === index; }

        uniqueSortedArray = (ar) => {
            return ar.filter(this.onlyUnique).sort()
        }

        showCurrentWindow = (state) => {
            let allRows = state.listData.length,
                perPage = state.clientOptions.itemsPerPage,
                maxPage = Math.ceil(allRows/perPage),
                curPage = state.clientOptions.activePage > maxPage ? (maxPage > 0 ? maxPage : 1) : state.clientOptions.activePage,
                step = state.clientOptions.pageStepCount,
                firstPage = curPage - Math.floor(step/2),
                firstShown = (curPage - 1) * perPage,
                lastShown = curPage * perPage > (allRows - 1) ? (allRows > 0 ? allRows - 1 : 0) : (curPage * perPage - 1),
                tmpAr = [], pagesToShow = [];
            
            firstPage = firstPage < 1 ? 1 : ( ( ( firstPage + step ) > maxPage ? ((maxPage - step) > 0 ? (maxPage - step) : 1) : firstPage ) );
    
            for (let i = firstPage; i <= (firstPage + step); i ++ ) if ( i > 0 && i <= maxPage) pagesToShow.push(i);
    
            for (let i = firstShown; i <= lastShown; i ++) if (state.listData[i] !== undefined) tmpAr.push(state.listData[i]);
            
            return {list: tmpAr, pages: pagesToShow, maxPage: maxPage};
        }

        pageFromUri = () => {
            let GET_ = this.parseGetParams(),
                page = 1;
    
            page = GET_.hasOwnProperty('page') && !isNaN(parseInt(GET_.page)) ? parseInt(GET_.page) : page;
            return page;
        }
}