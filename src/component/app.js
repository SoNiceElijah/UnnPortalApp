import '../style/app.css';
import portal from 'node-unn-portal';
import React from 'react';
import { convert, dateToString, DAYS, MONTHS } from '../tool/converter';
import { useSwipeable } from 'react-swipeable';
import SwipeListener from 'swipe-listener';

// Local server
portal.base('');

class App extends React.Component {

    constructor(props) {
        super(props);

        this.loading = false;

        this.days = [];
        this.dayidx = -1;
        this.generatedate = this.generatedate.bind(this);
        this.generatedate();

        this.state = {};
        this.state.metadate = "Tuesday, 09 Feb 2021"
        this.state.content = [] // "25009";

        this.mainpage = this.mainpage.bind(this);
        this.contentitem = this.contentitem.bind(this);
        this.buildstate = this.buildstate.bind(this);
        this.request = this.request.bind(this);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    generatedate() {
        let i = -14;
        let j = 0;
        while(i <= 14) 
        {
            let d = new Date();
            d.setDate(d.getDate() + i);
            this.days.push({
                month : MONTHS[d.getMonth()],
                day : DAYS[d.getDay()],
                number : d.getDate().toString(10).padStart(2,'0'),
                date : d,
                today : i === 0,
                id : Date.now() + "_" + Math.floor(Math.random() * 100000).toString(10).padStart(6,'0') + '_' + j,
                idx : j
            });
            ++i;
            ++j;
        }
        this.dayidx = 14;
    }
    
    componentDidMount() {
        this.request({ date : new Date() });

        //swipe events
        const element = document.getElementById('mainpage');
        const infopanel = document.getElementById('infopanel');
        const floatpanel = document.getElementById('floatpanel');
        const listener = SwipeListener(element,{ minHorizontal : 30, minVertical : 30 });
        element.addEventListener('swipe', (e) => {
            let dirs = e.detail.directions;
            if(dirs.left)
            {
                let next = this.days[this.dayidx+1];
                this.request(next);
            }
            if(dirs.right)
            {
                let next = this.days[this.dayidx-1];
                this.request(next);
            }
            if(dirs.top) 
            {
                floatpanel.classList.remove('main-page-closed');
                infopanel.classList.add('main-page-info-closed')
            }
            if(dirs.bottom)
            {
                floatpanel.classList.add('main-page-closed');
                infopanel.classList.remove('main-page-info-closed')
            }
        });
    }

    request(ctx) {
        let { date, id, idx } = ctx;
        if(this.loading || idx === this.dayidx) return;
        this.loading = true;
        /////////////////////////
        if(id) {
            document.getElementById(this.days[this.dayidx].id).classList.remove('cal-item-today');
            document.getElementById(id).classList.add('cal-item-today');
            this.dayidx = idx;
        }
        ////////////////////////
        document.getElementById("mainpage").setAttribute("down",true);
        ////////////////////////
        this.state.metadate = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
        portal.schedule.byGroup("25009",{start : date, finish : date})
            .then(this.buildstate);
    }

    calitem(ctx) {
        return (
            <div id={ctx.id} className={ctx.today ? "cal-item cal-item-today" : "cal-item"} onClick={() => { this.request(ctx); }} key={ctx.id}>
                <div className="cal-item-month">{ctx.month}</div>
                <div className="cal-item-number">{ctx.number}</div>
                <div className="cal-item-week">{ctx.day}</div>
            </div>
        );
    }

    buildstate(data) {
        if(!data) { console.log("ERROR!"); console.log(data); return; }
        let { error } = data;
        if(error) { console.log("ERROR!"); console.log(error); return; }
        data = data.map(d => convert(d));
        let arr = [];
        //let n = 8;
        //while(n--) arr.push({ emoji : '', name : '', empty : true });
        for(let e of data) arr.push(e);
        this.setState({content : arr});
        document.getElementById("mainpage").removeAttribute("down");
        this.loading = false;
    }

    contentitem(ctx) {
        console.log(ctx);
        return (
            <div className={`content-item ${ctx.empty ? 'content-item-empty' : ''}`} key={Date.now() + "_" + Math.random()}>
                <div className="content-item-time">
                    <div className="content-item-time-up">{ctx.from}</div>
                    <div className="content-item-time-down">{ctx.to}</div>
                </div>
                <div className="content-item-data">
                    <div className="content-item-data-name" dangerouslySetInnerHTML={{ __html : `${ctx.emoji} ${ctx.name}`}}></div>
                    <div className="content-item-data-place">{ctx.place}</div>
                    <div className="content-item-data-teacher">{ctx.tsign}</div>
                </div>
            </div>
        );
    }

    mainpage() {
        
        return (
            <div>
                <div id="infopanel" className="main-page-info">
                    <div className="main-page-info-logo">UNN</div>
                    <div className="main-page-info-reconnect">Logout</div>
                    <div className="main-page-info-content">
                        <div className="info-text-up">Ты следишь за</div>
                        <div className="info-text-main">381703-2</div>
                    </div>
                </div>
                <div id="floatpanel" className="main-page">                    
                    <div className="main-page-header-wrapper">
                        <div className="main-page-header">                    
                            {this.days.map((d,i) => this.calitem(d,i))}
                        </div>
                    </div>
                    <div id="mainpage" className="main-page-content-wrpper">
                        <div className="main-page-content-header">{this.state.metadate}</div>
                        <div className="main-page-content">
                            {this.state.content.map(c => this.contentitem(c))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="main">
                {this.mainpage()}
            </div>
        )
    }
}

export default App;
