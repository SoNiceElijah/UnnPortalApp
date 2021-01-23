import '../style/app.css';
import portal from 'node-unn-portal';
import React from 'react';
import { convert, dateToString, DAYS, MONTHS } from '../tool/converter';

// Local server
portal.base('');

class App extends React.Component {

    constructor(props) {
        super(props);

        this.days = [];
        this.generatedate = this.generatedate.bind(this);
        this.generatedate();

        this.state = {};
        this.state.content = [] // "25009";

        this.mainpage = this.mainpage.bind(this);
        this.contentitem = this.contentitem.bind(this);
        this.buildstate = this.buildstate.bind(this);
        this.request = this.request.bind(this);
       

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    generatedate() {
        let i = -14;
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
            });
            ++i;
        }
    }
    
    componentDidMount() {
        this.request(new Date());
    }

    request(date) {
        portal.schedule.byGroup("25009",{start : date, finish : date})
            .then(this.buildstate);
    }

    calitem(ctx) {
        return (
            <div className={ctx.today ? "cal-item cal-item-today" : "cal-item"} onClick={() => { this.request(ctx.date); }} key={Date.now() + "_" + Math.random()}>
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
        let n = 8;
        while(n--) arr.push({});
        for(let e of data) arr[e.num] = e;
        this.setState({content : arr});
    }

    contentitem(ctx) {
        console.log(ctx);
        return (
            <div className="content-item" key={Date.now() + "_" + Math.random()}>
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
            <div className="main-page">
                <div className="main-page-header-wrapper">
                    <div className="main-page-header">                    
                        {this.days.map(d => this.calitem(d))}
                    </div>
                </div>
                <div className="main-page-content-wrpper">
                    <div className="main-page-content">         
                        {this.state.content.map(c => this.contentitem(c))}
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
