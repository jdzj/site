/**
 edited:#2012-12-02 16:24:13
 coder:Mr.Gidot
 emal:gidot@qq.com
 版权声明：在使用或更改此程序时务必保留作者信息，
 另外，此程序未经作者许可禁止在任何商业场所使用,
 但若用于学习、研究或其他途径则不追究任何责任。
**/
var fm = new Object;
var timestamp=new Date().getTime();
fm.construct = function(){
    this.fstString = null;
    this.fstStringSelect = null;
    this.msg = null;
    this.begintime = 0;
    this.showMsg = function (msg, color,lock)
    {
        switch(color){
            case 'red':
                color = 'red';
                break;
            default:
                color = '#666666';
                break;
        }
        this.msg.innerHTML = '<span style="color:'+color+'">'+msg+'</span>';
        if (!lock)
        {
            setTimeout("fm.showMsg('就绪!','',true);",4000);
        }
    }
}
/*
 * 修正“——。”和“。——”为“。”，
 **/
var gt = new Object;
gt.construct = function(){
    this.textbox = null;
    this.idButton = null;
    this.text = "";
    this.arrText = [];

    this.o_fanjian = false;
    this.o_fanjianid = 0;
    this.o_trim = true;
    this.o_linespace = 1;
    this.o_banjiao = 0; //0,none;1,quan;2,ban.
    this.o_banjiaoArea = 0; //0,all;1,biaodian;2,number;4,zimu.
    this.o_bolangxian = false;

    this.o_paragraphFirstString = "　　";
    this.o_linefeedword = "\n";
    this.o_delFakeLinefeed = false;
    this.o_biaodian = true;
    
    
    this.typeset_go = function ()
    {
        this.boxlock();                      //lock textarea
        this.syncForm();                     //load option
        this.initialize();
        this.splitText();                    //split the Text to Array
        this.baseType();                     //base typeset
        this.mergeArray();                   //unsplit
        this.sumup();
        this.textbox.value = this.text;
        this.boxready();
    }

    this.initialize = function ()
    {
    	this.begintime = new Date().getTime();
    }

    this.sumup = function ()
    {
        this.cs2ct();                        //chinese s to t
        this.bolangxian();
        this.biaodian();
    }

    this.clear = function ()
    {
        this.textbox.value = "";
    }

    this.syncForm = function ()
    {
        this.text = this.textbox.value;
        if (this.text.trim() == '') 
        {
            alert('文本框里没有任何文本，巧妇难做无米之炊啊亲。');
            this.boxready();
            return false;
        }
        this.o_linespace = document.getElementById('linespaceSelect').value;
        this.o_trim = true;
        switch(document.getElementById('fstStringSelect').value)
        {
            case '1':
                this.o_paragraphFirstString = "";
                this.o_trim = false;
                break;
            case '2':
                this.o_paragraphFirstString = "　　";
                break;
            case '3':
                this.o_paragraphFirstString = "    ";
                break;
            case '4':
                this.o_paragraphFirstString = "";
                break;
            default:
                this.o_paragraphFirstString = document.getElementById('fstString').value;
        }
        if (!fast) this.o_fanjianid = document.getElementById('cs2ctSelect').value; 
        this.o_fanjian = this.o_fanjianid == '0' ? false : true;

        if(document.getElementById('quanjiao_no').checked)
            this.o_banjiao = 0;
        else if(document.getElementById('quanjiao_q').checked)
            this.o_banjiao = 1;
        else if(document.getElementById('quanjiao_b').checked)
            this.o_banjiao = 2;

        this.o_bolangxian = document.getElementById('xx_blx').checked;
        this.o_biaodian = document.getElementById('xx_bd').checked;


    }

    this.bolangxian = function ()
    {
        if (false == this.o_bolangxian) return false;   
        var temp = this.text;
        var i = 0;
        temp = temp.replace(/～/g,'——');
        temp = temp.replace(/￣/g,'——');
        temp = temp.replace(/－/g,'——');
        temp = temp.replace(/｀/g,'——');
        temp = temp.replace(/~/g,'——');
        temp = temp.replace(/`/g,'——');
        temp = temp.replace(/··/g,'——');

        while(temp.indexOf('———')>0)
        {
            temp = temp.replace(/———/g,'——');
            if (i++ > 99999999) break;
        }

        this.text = temp;
    }

    this.pre_biaodian_bat = function (text, key, replace)
    {
        last = 0;
        var i = 0;
        while(text.indexOf(key,last)>0)
        {
            last = text.indexOf(key,last);
            d = text.indexOf(key, last)-1;
            wd = text.substr(d,1);
            //prevchar is hanzi
            if (wd.charCodeAt()>999)
            {
                text = text.substr(0, d+1) + replace + text.substr(d+1+key.length); 
                
            }last ++;
            if (i++>99999) break;
        }
        return text;
    }


        //d = this.text.indexOf('.')-1;
        //wd = this.text.substr(d,1);
        //alert(wd.charCodeAt()>999);

    this.biaodian = function ()
    {
        if (false == this.o_biaodian) return false; 
        var temp = this.text;
        var i = 0;
        temp = temp.replace(/．/g ,'.');
        temp = temp.replace(/\.\.\.\.\.\./g, '……');
        temp = temp.replace(/\.\.\./g, '…');
        temp = temp.replace(/…\.\./g, '……');
        temp = temp.replace(/…\./g, '…');
        temp = temp.replace(/\.\./g, '');
        temp = temp.replace(/。。/g, '……');
        temp = temp.replace(/…。/g, '…');
        temp = temp.replace(/\(/g, '（');
        temp = temp.replace(/\)/g, '）');

        while(temp.indexOf('………')>0)
        {
            temp = temp.replace(/………/g,'……');
            if (i++ > 99999999) break;
        }
        temp = this.pre_biaodian_bat(temp, '.', '。');
        temp = this.pre_biaodian_bat(temp, ',', '，');
        
        i=0;
        while(temp.indexOf('，，')>0)
        {
            temp = temp.replace(/，，/g,'，');
            if (i++ > 99999999) break;
        }

        temp = this.pre_biaodian_bat(temp, '?', '？');
        temp = this.pre_biaodian_bat(temp, '!', '！');
        temp = this.pre_biaodian_bat(temp, ':', '：');
        temp = this.pre_biaodian_bat(temp, '<<', '《');
        temp = this.pre_biaodian_bat(temp, '>>', '》');

        this.text = temp;
        //
    }

    this.cs2ct = function ()
    {
        switch(this.o_fanjianid)
        {
            case '1':
                //chinese s
                this.ts('zh2Hans');
                break;
            case '2':
                //chinese s from China
                this.ts('zh2Hans');
                this.ts('zh2CN');
                break;
            case '3':
                //chinese s from Singapo
                this.ts('zh2Hans');
                this.ts('zh2SG');
                break;
            case '4':
                //chinese t
                this.ts('zh2Hant');
                break;
            case '5':
                //chinese t from Taiwan
                this.ts('zh2Hant');
                this.ts('zh2TW');
                break;
            case '6':
                //chinese t from Hongkong
                this.ts('zh2Hant');
                this.ts('zh2HK');
                break;
            default:
                this.o_fanjian = false;
        }
    }


    this.boxlock = function ()
    {
        this.idButton.disabled = true;
        this.textbox.disabled = true;
        fm.showMsg('排版中，请稍候……','',true);
 
    }
    this.boxready = function ()
    {
        this.idButton.disabled = false;
        this.textbox.disabled = false;
        fm.showMsg('排版完毕！耗时'+ (new Date().getTime()-this.begintime+1) +'ms','red');
    }

    this.splitText = function ()
    {
        this.arrText = this.text.split(this.o_linefeedword);
    }

    this.baseType = function ()
    {
        for ( var i = 0; i < this.arrText.length; i++ ) {
            if (this.o_trim) 
            {
                this.arrText[i] = this.o_paragraphFirstString+this.arrText[i].trim();
            }
            this.arrText[i] = this.b2q(this.arrText[i]);
        }
    }

    this.ts = function (w)
    {
        if (this.o_fanjian == false)
            return 0;

        a = this.text
        ba = 0;
        if (w == "zh2Hant") {
            ba = "10447"
        };
        if (w == "zh2Hans") {
            ba = "6815"
        };
        if (w == "zh2TW") {
            ba = "914"
        };
        if (w == "zh2HK") {
            ba = "2991"
        };
        if (w == "zh2CN") {
            ba = "615"
        };
        if (w == "zh2SG") {
            ba = "372"
        };
        for (na = 0; na < ba; na++) {
            a = a.replace(window.eval("/" + window.eval(w).words[window.eval(na)].t + "/g"), window.eval(w).words[window.eval(na)].c)
        };
        this.text = a; 
    }

    this.b2q = function (a)
    {
        if (this.o_banjiao == 0)
            return a;
        
        var w = "b2q", wba = "95";
        var w2 = "q2b", w2ba = "94";
        
        
        
        if (this.o_banjiao == 1)
        {//a = a.replace(window.eval(w).words[window.eval(na)].b, window.eval(w).words[window.eval(na)].q);
            for (na = 0; na < w2ba; na++) {
				a = a.replace(
                    window.eval("/" + window.eval(w2).words[window.eval(na)].b + "/g"), 
                    window.eval(w2).words[window.eval(na)].q
                );

        	}
        }
        else
        {
        	for (na = 0; na < wba; na++) {
        	    a = a.replace(window.eval("/" + window.eval(w).words[window.eval(na)].q + "/g"), window.eval(w).words[window.eval(na)].b);
			}
    	};

        return a;
    }

    this.mergeArray = function ()
    {
        if (this.o_linespace > 0)
        {
            this.text = "";
            var thislinefeed = "";
            for ( var i = 0; i < this.o_linespace; i++ ) thislinefeed += this.o_linefeedword+"";
            for ( var i = 0; i < this.arrText.length; i++ ) {
                if (this.arrText[i].trim() == "") continue;
                this.text += this.text == '' ? this.arrText[i] : thislinefeed + this.arrText[i];
            }    
        }else
        {
            this.text = this.arrText.join(this.o_linefeedword);
        }
    }
    this.teststring = function ()
    {
        this.textbox.value = "现在请按“开始排版”，看看效果吧？ \n \n一路上，俩人恩爱交织，狂喜窃笑皆成涟漪；夜宿边关望明月，晓闻羌笛报晓声，恨不得一生一世如此相守.胡天八月，风沙连翩，高大的他总是为瘦小的她举一把伞，怕她白皙的皮肤被强烈的紫外线晒伤，她一直是那么瘦。 \n \n\n\n   跟着旅行团去楼兰遗址。夕阳刺眼如血，风干的石窟上百孔千疮，诉尽了沧桑，她不时被路边胡杨树上旋起的秃鹫吓得惊叫。导游笑着告诉大家，别害怕，那些飞禽只吃死尸。 \n    \n　夜了，汽车突然爆胎，众人只好弃车而行。她的脚崴了，他陪着她一步步慢行，渐渐地掉了队。他背起她，向着远方的灯火蹒跚而去。大漠的天气喜怒无常，转眼间刮起沙暴，他把她藏在背风处，用脊梁替她遮挡风沙。一切风平浪静后，他又背着她赶路。 \n    \n　　　　她心疼他，要他歇歇。他笑了笑说不要紧，然后舔了舔干燥的嘴唇继续前行~~~~~~~~~~~~~~~```````````~~~```````他不敢停下来，因为他知道，刚才的沙暴，卷走了他们的背囊。他没有告诉她。 \n \n\n天亮了，远处的灯火逐渐消失。他还没找到路，她发现背囊丢了，顿时惊慌起来。他笑笑，摸着她的长发，说不要紧，有我呢。夜幕再次降临，他们筋疲力尽，却又望见远处的灯火。她走不动，他又将她背起，身后留下一个个深深的脚印。 \n　第三天，他也没有了力气。她的眼神开始绝望，爬在他怀里哭。他好言相慰，抬头之间无意看到飞逝的流星划过夜空，心中有了答案。他计算好了一切，陪她说话，不再着急赶路。他知道，远方的灯火，只是天边的星光。他和她，早已经走进绝境。 \n白天，她渴得快要昏迷，肌肤上泛起一层层脱落的皮，泛着淡淡的红。他看着心疼，说我们不走了，很快会有人来的。伞早已经不见，他用双手撑地，将她放在自己的影子中，任凭阳光侵袭着后背。他一直这样的坚持，看到她憔悴的面容，干裂的嘴唇，落下泪来。一滴滴，都溅在她的唇间。而她，却已经不省人事。 \n    \n 　   他们失踪的第六天中午，营救小组望到沙漠深处的不时飞起几只秃鹫，他们心生疑窦，走近看时，便有几个人失声痛哭：他早已死去，却还保持着那种俯卧的姿势，双手深深插入沙里，后背被秃鹫啄得血肉模糊。而她，完好无损的躺在他的影子里，宛若熟睡。 \n    \n 　   两个月后，她恢复健康，在他坟墓旁搭了间木屋，给他的墓旁种满植物，梧桐树、常青藤……一片稠绿如绘，浓郁的树阴遮住了墓碑。 \n 她也要他，一生睡在自己播种的影子下，清凉如泪。\n\n注：此文版权归原作者，这里仅作软件测试使用。";
    }
    this.teststringForBiaodian = function ()
    {
        this.textbox.value = "选中排版选项中的“标点修正”和“波浪线修正”来排一下本文，看看效果吧。\n\n\n首先,标点修正会将半角逗号修正为全角,把句点修正为句号.能将半角的冒号修正为全角冒号:看看是不是这样.还会将半角的问号变为全角问号:“?”\n标点修正对省略号的修正更是体贴,比如将连续的句号修正成为一个省略号。。。。。。。。。。还可以将连续的句点修正为一个省略号.......能将多余的省略号合并为一个……………………\n还可以将连续的逗号合并为一个逗号，，并且能修正不标准的书名号，比如:<<基督山伯爵》，这就是标点修正的基本功能演示.\n\n另外,如果是英文句子或者网址,句点问号和冒号等是不会被转换的,这一点要优于排版助手桌面版早期的修正功能.\neg. http://www.gidot.net/\n\n\n排版助手还可以修正网络文章中经常出现的波浪线，比如~~~~~~~~~`````会被转换成标准的破折号。";
    }
    this.loadOption = function ()
    {
        // GetCookie("email")==null?"":GetCookie("email");
        this.minceOption_0('xx_bd', 'option0');
        this.minceOption_0('xx_blx', 'option1', true);
        this.minceOption_0('selectall', 'option2', true);
        this.minceOption_1('linespaceSelect', 'option3', '2');
        this.minceOption_1('fstStringSelect', 'option4', '2');
        if (!fast) this.minceOption_1('cs2ctSelect', 'option5', '0');
        this.id('fstString').value = this.getcookie('option6')==null?'　　':this.getcookie('option6');
    }
    this.minceOption_0 = function (id, coname, defaultvalue)
    {
        var defaultvalue= arguments[2] || false;
        this.id(id).checked = this.getcookie(coname)==null?defaultvalue:this.getcookie(coname)=='true';
    }
    this.minceOption_1 = function (id, coname, defaultvalue)
    {
        this.id(id).value = this.getcookie(coname)==null?defaultvalue:this.getcookie(coname);
    }
    this.saveOption = function ()
    {
        // SetCookie2("name",document.postcomment.name.value,999999999);
        this.setcookie('option0', this.id('xx_bd').checked, 999999999);
        this.setcookie('option1', this.id('xx_blx').checked, 999999999);
        this.setcookie('option2', this.id('selectall').checked, 999999999);
        this.setcookie('option3', this.id('linespaceSelect').value, 999999999);
        this.setcookie('option4', this.id('fstStringSelect').value, 999999999);
        if (!fast) this.setcookie('option5', this.id('cs2ctSelect').value, 999999999);
        this.setcookie('option6', this.id('fstString').value, 999999999);
    }
    this.setcookie = function (sName, sValue, iTime)
    {
        var date = new Date(); 
        date.setTime(date.getTime()+iTime*1000);
        document.cookie = escape(sName) + "=" + escape(sValue) + "; expires=" + date.toGMTString(); 
    }
    this.getcookie = function (name)
    {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen)
        {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return this.GetCookieVal (j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }
    this.GetCookieVal = function (offset)
    {
        var endstr = document.cookie.indexOf (";", offset);
        if (endstr == -1)
            endstr = document.cookie.length;
        return unescape (document.cookie.substring(offset, endstr));
    }
    this.id = function (a)
    {
        return document.getElementById(a);
    }
}



String.prototype.trim = function(){ 
    return this.replace(/^( |[\s　])+|( |[\s　])+$/g, ""); 
}
gt.construct();
fm.construct();


window.onload = function(){
    gt.textbox = document.getElementById('textbox');
    gt.idButton = document.getElementById('button');
    fm.msg = document.getElementById('msg');
    fm.fstString = document.getElementById('fstString');
    fm.fstString = document.getElementById('fstStringSelect');
    fm.showMsg('就绪!','',true);
    document.getElementById('gtform').style.display='';
    resize();
    gt.loadOption();
    showfstStringSpan();
    setInterval("gt.saveOption()",3000);
};
