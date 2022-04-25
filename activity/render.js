var mem
var mem_title 
export function layout(title, content,user) {
  var view 
  if(title!='')
  {
     mem = content
     mem_title = title
    view =mem
  }

  if(title =='')
  {
    title = mem_title
    view =  mem + content 
  }
  
  var loginstatus
  if(user!=undefined)
  {
loginstatus= `<li style="float:right">歡迎${user} <a href="/editpassword_user/${user.id}">變更密碼</a><a href="/logout">登出</a></li>`



} 
  else if (user==undefined)
  {
    loginstatus=`<li style="float:right"><div style="cursor:hand" onclick="isHidden()"><a class="active" >登入</a></div></li>
    ` 
  }
  return `
  <html>
  <head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <link rel="stylesheet" href="images/css/slick.css">
    <link rel="stylesheet" href="images/css/slick-theme.css">
    <style>
   
    body {
      margin: 0;
      padding: 0;
    background-color:  #D1E9E9;
      font-family: Arial, Helvetica, sans-serif;
      font: 2vh Helvetica, Arial;
    }


    #posts {
      margin: 0;
      padding: 0;
    }
    #posts li {
      width:30%;
      list-style: none;
    }
    
    /*游標 搜尋標記*/
    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 10px dotted red;
  }
  
  .tooltiptext {
      visibility: hidden;
      width: 120px;
      background-color: red;
      color: #fff;
      text-align: center;
      border-radius: 10px;
      padding: 5px 0;
      }
  .tooltip:hover .tooltiptext {
        visibility: visible;
    }
/*登入UI*/
    .formlogin
    {
      display: none;
      background-color: #FFFFFF ;
      width:400px;
      height:400px;
      border-radius:4em;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  
    input[type=text],input[type=password],
    textarea {
      border: 1px solid #eee;
      padding: 15px;
      font-size: .8em;
    }
   
    /*slider*/
   
    .slick-slide {
      margin: 20px 20px -100px 20px;
      transition: all ease-in-out .3s;
      opacity: .2;
    }
    
    .slick-active {
      opacity: .5;
    }
    .slick-current {
      opacity: 1;
    }
    /*slider*/

    
    /*sidebar*/
    .sidenav {
      height: 100%;
      width: 0;
      position: fixed;
      z-index: 3;
      top: 0;
      left: 0;
      background-color: #111;
      overflow-x: hidden;
      transition: 0.5s;
      padding-top: 60px;
    }
    
    .sidenav a {
      padding: 8px 8px 8px 32px;
      text-decoration: none;
      font-size: 25px;
      color: #818181;
      display: block;
      transition: 0.3s;
    }
    
    .sidenav a:hover {
      color: #f1f1f1;
    }
    
    .sidenav .closebtn {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
    }
    /*上面是sidebar*/
    /*navbar*/
    
    li {
      float: left;
    }
    
    li a, .dropbtn {
      display: inline-block;
      color: white;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
    }
    
    li a:hover, .dropdown:hover .dropbtn {
      background-color: red;
    }
    
    li.dropdown {
      display: inline-block;
    }
    
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }
    
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
    }
    
    .dropdown-content a:hover {background-color: #f1f1f1;}
    
    .dropdown:hover .dropdown-content {
      display: block;
    }
    /*上面是navbar*/
    
/*大小設定*/
        @media (min-width:400px){ 
          .see{display:inline}
          .small{width: 500px;}
          .nosee{display: none}
          .dropbtn1{display:none}
          
        }
          
          
          @media (min-width:1000px){
            .see{display:none}
            .small{width: 1000px;height:600px}
          .nosee{display:inline}
          .dropbtn1{display:inline-block}
          

        }
    </style>
  </head>
  <body id="bodylogin">
  <!--側欄-->
  <ul style="list-style-type: none;padding: 0;overflow: hidden;background-color: #38444d;">
  <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#">關於機構</a>
      <a href="#">畢業專題</a>
      <a href="#">實習報告書</a>
      <a href="#">聯絡我們</a>
    </div>
    <!--側欄點擊按鈕-->
    <span class="see" style="font-size:30px;float:left;cursor:pointer" onclick="openNav()">&#9776; </span>
    <!--上面那欄-->
  <li class="nosee"><a href="/home">回首頁</a></li>
  <li class="nosee"><a href="/list_gratuate">畢業專題</a></li>
  <li class="nosee"><a href="/">實習報告書</a></li>
  <li class="nosee"><a href="/about">關於機構</a></li>
  <li class="nosee"><a href="#news">聯絡我們</a></li>
</li>
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn1">常見問題</a>
    <div class="dropdown-content">
      <a href="#">忘記密碼</a>
      <a href="#">Q2</a>
      <a href="#">Q3</a>
    </div>
  </li>
  ${loginstatus}
  
  
</ul>
   
<div class="formlogin" style="z-index:2;opacity:0.0;" id ="div2" >   
    <form action="/login" method="post" >
    <p>登入窗口</p>
    <p><a>帳號：</a><input type="text" placeholder="帳號"  name="account" style="width:auto;"></p>
    <p><a>密碼：</a><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
    <p><input type="submit" value="登入"></p>
    <p onclick="recover()">等等再登入</p>
  </form>
  </div>
  <div id ="div1" style="display:block;opacity:1.0; " >
  ${view}
  </div>
  
  </body>
  <script>
  function isHidden(){    
      div1.style.opacity='0.05'; 
      div2.style.opacity='2.0';
      div2.style.display='block';
  }
  function recover(){
   
    div2.style.opacity='0.0'; 
    div1.style.opacity='1.0';
    div2.style.display='none';
}
</script>
  </html>
  `
}



/*else
{
  return `
  <html>
  <head>
  
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <style>
    /*登入textarea
    
    
  
 
    body {
      
      background-color:  #D1E9E9;
        font-family: Arial, Helvetica, sans-serif;
        padding: 100px;
        font: 16px Helvetica, Arial;
      }
    #bodylogin {
      
      background-color:  #D1E9E9;
        font-family: Arial, Helvetica, sans-serif;
        padding: 50px;
        font: 20px Helvetica, Arial;
      }
    
  
      h1 {
        font-size: 2em;
      }
      h2 {
        font-size: 1.2em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        padding: 20px;
        border-style:solid;
        list-style: none;
      }
  
     
  
      
      header{
        font-size: 50px;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
         background-color:cyan;
         margin-top: -80px;
         text-align: center;
         height:70px;
      }
     
      article{
        width:auto;
        height:auto;
      }
      
    main
    {
      
      height:300px;
      width:300px;
    }
    
    </style>
  </head>
 
  ${content}
 
  </html>
  `
}
  
}
/*1223check*/
/*export function loginUi(args={},user)  {
  var alertScript
  var alertScriptshow
  var alertScriptstu
  if (args.status == '這是傳給老師的') {
    alertScript = `<p>帳號或密碼有誤<p>`
    alertScriptstu = ''
    alertScriptshow = ''
  } 

  else if (args.status == '這是傳給學生的') {
    alertScript = ''
    alertScriptshow = ''
    alertScriptstu = `<p>帳號或密碼有誤<p>`
  } 

  else if (args.status == '請先登入'||args.status == '不可輸入特殊符號'||args.status == '修改成功') {
    alertScript = ''
    alertScriptstu = ''
    alertScriptshow = `<script>
    alert('${args.status}')
    </script>`
  } 
  
  else {
    alertScript = ''
    alertScriptstu = ''
    alertScriptshow = ''
  }
  return layout('學習歷程檔案登入', `
  
  <body id="bodylogin">
  ${alertScriptshow}
  <div class="login">
  <div class="formloginleft">
  <img class="small" style="width:200px;height:200px " src="images/管理員登入.png" />
  <form action="/login" method="post" >
  <p>管理者登入</p>
  <p><input type="text" placeholder="帳號"  name="account" style="width:auto;"></p>
  <p><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
  <p><input type="submit" value="登入"></p>
  ${alertScript}
  
</form>
</div>
</div>
<div class="formloginright">
<img class="small" style="width:200px;height:200px " src="images/使用者登入.png" />
<form action="/loginstu" method="post" >
<p>使用者登入</p>
<p><input type="text" placeholder="帳號"  name="account" style="width:auto;"></p>
<p><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
<p><input type="submit" value="登入"></p>
${alertScriptstu}
</form>
</div>
  </body>
  `,user)
}*/

export function middle(args={},user){
  return layout(
    '',`<script>
    alert('${args.status}')
    </script>`,user)
}

export function homeUi(user)  { 
  return layout('學習歷程檔案首頁', `
  <div class="container">
        <img class="small" style="display:block; margin:auto; " src="images/1.jpg" />
        <img class="small" style="display:block; margin:auto;" src="images/2.jpg" />
        <img class="small" style="display:block; margin:auto;" src="images/3.jpg" />
        <img class="small" style="display:block; margin:auto;" src="images/4.jpg" />
        <img class="small" style="display:block; margin:auto;" src="images/5.jpg" />
  </div>
    <script type="text/javascript" src="images/js/1.js"></script>
    <script type="text/javascript" src="images/js/2.js"></script>
    <script type="text/javascript" src="images/js/slick.min.js"></script>
    <script type="text/javascript" src="images/js/slick.js"></script>
<script type="text/javascript">
$('.container').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
});
</script>
    <script>
    function openNav() {
      document.getElementById("mySidenav").style.width = "200px";
    }
    
    function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    }
    </script>
 
  `,user)
}

export function aboutUi(user)  { 
  return layout('關於機構', `
  <map name="taiwan">
	<area shape="poly" coords="364,36,390,35,382,54" href="place/基隆市.html">
      <area shape="poly" coords="338,38,354,24,366,63,347,60" href="place/台北市.html">
      <area shape="poly" coords="316,40,356,12,421,61,341,116" href="place/新北市.html">
      <area shape="poly" coords="316,41,342,116,327,133,267,70" href="place/桃園市.html">
      <area shape="poly" coords="264,75,323,140,316,158,268,113,281,102,260,80" href="place/新竹縣.html">
      <area shape="poly" coords="257,90,268,101,252,105" href="place/新竹市.html">
      <area shape="poly" coords="248,110,310,161,257,182,206,161" href="place/苗栗縣.html">
      <area shape="poly" coords="203,165,253,189,274,188,312,169,332,179,315,199,219,236,185,199" href="place/台中市.html">
      <area shape="poly" coords="180,203,213,231,208,265,147,262" href="place/彰化縣.html">
      <area shape="poly" coords="147,265,207,273,219,309,172,303,131,323" href="place/雲林縣.html">
      <area shape="poly" coords="123,326,174,303,229,313,247,331,204,366,174,341,121,348" href="place/嘉義縣.html">
      <area shape="poly" coords="123,363,160,350,179,349,196,384,152,426,127,422" href="place/台南市.html">
      <area shape="poly" coords="131,450,163,491,170,445,205,432,236,437,229,403,261,340" href="place/高雄市.html">
      <area shape="poly" coords="174,505,185,457,234,450,213,478,238,562,229,597" href="place/屏東縣.html">
      <area shape="poly" coords="237,535,226,485,247,462,265,367,429,457,362,624" href="place/台東縣.html">
      <area shape="poly" coords="308,386,277,352,306,305,344,186,382,188,343,334" href="place/花蓮縣.html">
      <area shape="poly" coords="321,161,405,86,387,171" href="place/宜蘭縣.html">
      <area shape="poly" coords="311,208,272,326,213,290,218,241" href="place/南投縣.html">
      <area shape="poly" coords="7,259,53,257,53,326,3,332" href="place/澎湖縣.html">
      <area shape="poly" coords="10,11,114,11,118,80,12,81" href="/mechanism">
      <area shape="poly" coords="8,93,115,92,115,164,12,165" href="place/連江縣.html">
    </map>
    <img style="display:block; margin:auto;" src="/images/taiwan.png" usemap="#taiwan">
  
  
  `,user)
}


export function signup_teacherUi(args={}) {
  var alertScript
  if (args.status != null) {
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } 
  else {
    alertScript = ''
  }
  return layout('管理員註冊',` 
  <h1>每個選項都要填(別新增太多!!)</h1>
  <form action="/signup_teacher" method="post">
    <p><input type="text" placeholder="帳號" name="account"></p>
    <p><input type="password" placeholder="密碼" name="password"></p>
    <p><input type="text" placeholder="手機號碼" name="username"></p>
    <p><input type="submit" value="新增"></p>
  </form>
  ${alertScript}
  `
  
  )
}

export function signup_studentUi(args={}) {
  var alertScript
  if (args.status != null) {
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } else {
    alertScript = ''
  }
  return layout('使用者註冊',` 
  <h1>每個選項都要填</h1>
  <form action="/signup_student" method="post">
    <p><input type="text" placeholder="學號" name="account"></p>
    <p><input type="password" placeholder="密碼" name="password"></p>
    <p><input type="text" placeholder="入學級別和姓名(例如:108級王曉明)/老師姓名與職位(例如:黃大銘教授)" name="username"></p>
    <p><input type="submit" value="註冊"></p>
  </form>
  ${alertScript}
  `
  
  )
}



export function changeaccount() {
  return layout('變更密碼', `
  <h1>Success!</h1>
  You may <a href="/">read all Post</a> again !
  `)
}


export function editaccount(users,roots) {
  console.log("級別與姓名",users)
  let list = []
  for (let user of users) {
    list.push(`
    <li style="border-color: crimson">
    <p>帳號：${user.account}</p>
      <p>密碼：${user.password}</p>
      <p>級別姓名：${user.username}</p>
      <p><a href="/delaccount_user/${user.id}">刪除</a></p>
      <p><a href="/editpassword_user/${user.id}">編輯</a></p>
      </li>
    `)
  }
  for (let root of roots) {
    list.push(`
    <li style="border-color: crimson">
    <p>管理員帳號密碼(除非帳號密碼被破解，否則別刪掉!!)</p>
    <p>帳號${root.username}</p>
      <p>密碼${root.password}</p>
      <p><a href="/editpassword_root/${root.id}">變更</a></p>
      </li>
    `)
  }
  let content = `
  <body>
  <article>
  <p><a href="/signup_student">新增使用者帳號</a><a href="/signup_teacher">新增管理員帳號</a><a href="/">回首頁</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('帳號密碼管理', content)
}

/*1223check*/ 
export function editpassword_userui(user,args={}) {
  var alertScript
  if (args.status =='舊密碼錯誤'||args.status =='新密碼與再次確認密碼有誤'||args.status =='不可輸入特殊符號或空白') {
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } 
  else {
    alertScript = ''
  }

  return layout(user.username+'正在修改密碼', `
 
<body>
${alertScript}
  <h1>編輯中</h1>
  <form action="/editpassword_user/${user.id}"  method="post">
  <p><input type="text" placeholder="舊密碼" name="password_check" ></p>
  <p><input type="text" placeholder="新密碼" name="password_new" ></p>
  <p><input type="text" placeholder="再次確認新密碼" name="password_new_check" ></p>
    
    <p><input type="submit" value="修改"></p>
  </form>
  </body>
  `)
}

/* check1223*/
export function editpassword_user_for_rootui(user,args={}) {
  var alertScript
  if (args.status =='不可輸入特殊符號或空白') {
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } 
  else {
    alertScript = ''
  }
  return layout("正在編輯"+user.username, `
 
<body>
${alertScript}
  <h1>編輯中</h1>
  <form action="/editpassword_user_for_root/${user.id}"  method="post">
  <p>變更帳號：<input type="text" placeholder="帳號" name="account" value="${user.account}"></p>
  <p>變更密碼：<input type="text" placeholder="密碼" name="password" value="${user.password}"></p>
  <p>變更姓名及級別<input type="text" placeholder="名稱" name="username" value="${user.username}"></p>
    <p><input type="submit" value="修改"></p>
  </form>
  </body>
  `)
}


export function editpassword_rootui(user,args={}) {
  var alertScript
  if (args.status =='不可輸入特殊符號或空白') {
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } 
  else {
    alertScript = ''
  }
  return layout(user.id, `
 
<body>
${alertScript}
  <h1>編輯中${user.id}</h1>
  <form action="/editpassword_root/${user.id}"  method="post">
  <p><input type="text" placeholder="使用者帳號" name="account" value="${user.account}"></p>
  <p><input type="text" placeholder="使用者密碼" name="password" value="${user.password}"></p>
    <p><input type="submit" value="修改"></p>
  </form>
  </body>
  `)
}


export function list(posts, user) {
  let list = []
  var color_choose = 1;
  var color
  for (let post of posts) {
    if(color_choose%2==0)
    color="#b0dfda"
    else if(color_choose%2==1)
    color="#eecbe7"
    

    list.push(`
   
    <li style="background:${color}; margin:10px">
    <p>${post.title}<a style="padding: 0" href="/delpost/${post.id}">刪除貼文</a><a style="padding: 0" href="/editpost/${post.id}">編輯貼文</a></p>
    <p>作者：${post.username}</p>
    <p>入學級別與實習時間：${post.body}</p>
    <p>類別：${post.content}</p>
    <p><a padding: 0 href="/images/${post.file}">查看資料</a></p>
    </li>
    `)
    color_choose=color_choose+1;
  }

  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a> 
  <form action="/list_custom" method="post">
  
  <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
  <input type="submit" value="搜尋">
 
  <div class="tooltip">游標移過來
  <span class="tooltiptext">搜尋說明：如果要搜尋"松柏園"。關鍵字打"松"或"柏""園"都可以出來歐</span>
</div>
<p>進階搜尋</p>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">機構名稱</label>
<input type="checkbox" id="vehicle2" name="class" value="class">
<label for="vehicle1">級別</label>
<input type="checkbox" id="vehicle3" name="content" value="content">
<label for="vehicle1">文章類別</label>
</form></p>
  <ul id="posts" >
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('金大社工系學習歷程專區', content,user)
}


export function list_gratuate_teacher(posts, user) {
   
  let list = []
  var color_choose = 1;
  var color
  for (let post of posts) {
    if(color_choose%2==0)
    color="#b0dfda"
    else if(color_choose%2==1)
    color="#eecbe7"

    list.push(`
   
    <li style="background:${color}; margin:10px">
     <p>${ post.title}<a href="/delpost/${post.id}">刪除貼文</a><a href="/editpost/${post.id}">編輯貼文</a></p>
     <p>類別：${post.content}</p>
     <p>作者：${post.username}</p>
     <p>入學級別與實習時間：${post.body}</p>
     <p><a style="padding: 0" href="/images/${post.file}">查看資料</a></p>
     </li>
     `)
     color_choose=color_choose+1;
   }
 
   let content = `
   <body>
   <article>
   <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a> 
   <form action="/list_custom" method="post">
   
   <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
   <input type="submit" value="搜尋">
  
   <div class="tooltip">游標移過來
   <span class="tooltiptext">搜尋說明：如果要搜尋"松柏園"。關鍵字打"松"或"柏""園"都可以出來歐</span>
 </div>
 <p>進階搜尋</p>
 <input type="checkbox" id="vehicle1" name="title" value="title">
 <label for="vehicle1">機構名稱</label>
 <input type="checkbox" id="vehicle2" name="class" value="class">
 <label for="vehicle1">級別</label>
 <input type="checkbox" id="vehicle3" name="content" value="content">
 <label for="vehicle1">文章類別</label>
 </form></p>
   <ul id="posts">
     ${list.join('\n')}
   </ul>
   </article>
   </body>
   `
   return layout('金大社工系學習歷程專區', content,user)
 }
 
 export function list_gratuate_student(posts, user) {
   
  let list = []
  var color_choose = 1;
  var color
  for (let post of posts) {
    if(color_choose%2==0)
    color="#b0dfda"
    else if(color_choose%2==1)
    color="#eecbe7"

    list.push(`
   
    <li style="background:${color}; margin:10px">
     <p>${ post.title}</p>
     <p>類別：${post.content}</p>
     <p>作者：${post.username}</p>
     <p>入學級別與實習時間：${post.body}</p>
     <p><a style="padding: 0" href="/images/${post.file}">查看資料</a></p>
     </li>
     `)
     color_choose=color_choose+1;
   }
 
   let content = `
   <body>
   <article>
   <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a> 
   <form action="/list_custom" method="post">
   
   <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
   <input type="submit" value="搜尋">
  
   <div class="tooltip">游標移過來
   <span class="tooltiptext">搜尋說明：如果要搜尋"松柏園"。關鍵字打"松"或"柏""園"都可以出來歐</span>
 </div>
 <p>進階搜尋</p>
 <input type="checkbox" id="vehicle1" name="title" value="title">
 <label for="vehicle1">機構名稱</label>
 <input type="checkbox" id="vehicle2" name="class" value="class">
 <label for="vehicle1">級別</label>
 <input type="checkbox" id="vehicle3" name="content" value="content">
 <label for="vehicle1">文章類別</label>
 </form></p>
   <ul id="posts">
     ${list.join('\n')}
   </ul>
   </article>
   </body>
   `
   return layout('金大社工系學習歷程專區', content,user)
 }


export function liststu(posts, user) {
  let list = []
  var color_choose = 1;
  var color
  for (let post of posts) {
    if(color_choose%2==0)
    color="#b0dfda"
    else if(color_choose%2==1)
    color="#eecbe7"
    

    list.push(`
   
    <li style="background:${color}; margin:10px">
    <p>${post.title}</p>
    <p>作者：${post.username}</p>
    <p>入學級別與實習時間：${post.body}</p>
    <p>類別：${post.content}</p>
    <p><a style="padding: 0" href="/images/${post.file}">查看資料</a></p>
    </li>
    `)
    color_choose=color_choose+1;
  }

  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a> 
  <form action="/list_custom" method="post">
  
  <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
  <input type="submit" value="搜尋">
 
  <div class="tooltip">游標移過來
  <span class="tooltiptext">搜尋說明：如果要搜尋"松柏園"。關鍵字打"松"或"柏""園"都可以出來歐</span>
</div>
<p>進階搜尋</p>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">機構名稱</label>
<input type="checkbox" id="vehicle2" name="class" value="class">
<label for="vehicle1">級別</label>
<input type="checkbox" id="vehicle3" name="content" value="content">
<label for="vehicle1">文章類別</label>
<p>分類列表</p>
<p>領域</p>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">兒童</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">少年</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">家庭</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">身障</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">老人</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">醫務</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">法律與政策</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">其他</label>
<p>年度</p> 
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">104年度</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">105年度</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">106年度</label>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">107年度</label>


</form></p>
  <ul id="posts" >
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('金大社工系學習歷程專區', content,user)
}


export function newPost(args={}) {
  var alertScript
  if(args.status=='請上傳檔案'||args.status=='不可空白'||args.status=='檔案類型錯誤，可接受檔案類型為pdf'||args.status=='不可輸入特殊符號')
  {
 alertScript=`<script>
  alert('${args.status}')
  </script>`
  }
 
  else
  alertScript=''
  return layout('New Post',
 
  `    
  <body>
    <h1>新貼文</h1>
    <form action="/post" enctype="multipart/form-data" method="post" >
      <p><input type="text" placeholder="機構名稱(全名)" name="title"></p>
      <p><input type="text" placeholder="入學級別和姓名(例如:王曉明)/老師姓名與職位(例如:黃大銘教授)" name="author"></p>
      <p>文章類別</p>
  <input type="checkbox" id="vehicle1" name="content1" value="#兒童">
  <label for="vehicle1">兒童</label>
  <input type="checkbox" id="vehicle2" name="content2" value="#少年">
  <label for="vehicle2">少年</label><br>
  <input type="checkbox" id="vehicle3" name="content3" value="#家庭">
  <label for="vehicle3">家庭</label>
  
  <input type="checkbox" id="vehicle4" name="content4" value="#身障">
  <label for="vehicle4">身障</label><br>
  <input type="checkbox" id="vehicle5" name="content5" value="#老人與長照">
  <label for="vehicle5">老人</label>
  <input type="checkbox" id="vehicle6" name="content6" value="#醫務">
  <label for="vehicle6">醫務</label><br>
  <input type="checkbox" id="vehicle7" name="content7" value="#法律與政策">
  <label for="vehicle7">法律與政策</label>
  <input type="checkbox" id="vehicle8" name="content8" value="#其他">
      <label for="vehicle8">其他</label><br>
      <p><select name="body1">
      <option value="">入學級別部別</option>
      <option value="110日間部">110日間部</option>
      <option value="110進修部">110進修部</option>
      <option value="109日間部">109日間部</option>
      <option value="109進修部">109進修部</option>
      <option value="108日間部">108日間部</option>
      <option value="108進修部">108進修部</option>
      <option value="107日間部">107日間部</option>
      <option value="107進修部">107進修部</option>
      <option value="106日間部">106日間部</option>
      <option value="106進修部">106進修部</option>
      <option value="105日間部">105日間部</option>
      <option value="105進修部">105進修部</option>
      <option value="104日間部">104日間部</option>
      <option value="104進修部">104進修部</option>
    </select></p>
    <p><select name="body2">
    <option value="">實習期間</option>
    <option value="實習一">實習一</option>
    <option value="實習二">實習二</option>
    <option value="畢業專題">畢業專題</option>
    <option value="其他">其他</option>
    </select></p>
  
      <p>檔案上傳(僅限pdf!!!): <input type="file" name="file" accept="pdf"/></p>
      <p><input type="submit" value="建立"></p>
    </form>
  </body>
  ${alertScript}
  
  
  `
  )
}


/*export function newPoststu(args={}) {
  var alertScript
  if(args.status=='請上傳檔案')
  {
 alertScript=`<script>
  alert('${args.status}')
  </script>`
  }
  else
  alertScript=''
  return layout('New Post',
 
  `    
  <body>
    <h1>新貼文</h1>
    <form action="/poststu" enctype="multipart/form-data" method="post" >
      <p><input type="text" placeholder="機構名稱(全名)" name="title"></p>
      
      <p><select name="content">
      <option value="">文章類別</option>
      <option value="兒少">兒少</option>
      <option value="家庭" >家庭</option>
      <option value="身心障礙">身心障礙</option>
      <option value="老人與長照">老人與長照</option>
      <option value="婦女">婦女</option>
      <option value="law">法律與政策</option>
      <option value="Medical">醫務</option>
      <option value="other" >其他</option>
    </select></p>
      <p><textarea placeholder="心得或給學弟妹的建議" name="body"></textarea></p>
      <p>檔案上傳: <input type="file" name="file"/></p>
      <p><input type="submit" value="新增"></p>
    </form>
  </body>
  ${alertScript}
  
  
  `
  )
}*/




export function editpostui(post,args={}) {
  var alertScript
  if(args.status=='請上傳檔案'||args.status=='不可空白'||args.status=='不可輸入特殊符號'||args.status=='檔案類型錯誤，可接受檔案類型為pdf')
  {
 alertScript=`<script>
  alert('${args.status}')
  </script>`
  }
  else
  
  alertScript=''
  return layout(post.title, `
  
  ${alertScript}
  
  <body>
    <h1>新貼文</h1>
    <form action="/editpost/${post.id}" enctype="multipart/form-data" method="post" >
      <p><input type="text" placeholder="機構名稱(全名)" name="title" value="${post.title}"></p>
      <p><input type="text" placeholder="姓名(例如:王曉明)/老師姓名與職位(例如:黃大銘教授)" name="author" value="${post.username}"></p>
      <p>文章類別</p>
      <input type="checkbox" id="vehicle1" name="content1" value="兒童/">
      <label for="vehicle1">兒童</label>
      <input type="checkbox" id="vehicle2" name="content2" value="少年/">
      <label for="vehicle2">少年</label><br>
      <input type="checkbox" id="vehicle3" name="content3" value="家庭/">
      <label for="vehicle3">家庭</label>
      <input type="checkbox" id="vehicle4" name="content4" value="身障/">
      <label for="vehicle4">身障</label><br>
      <input type="checkbox" id="vehicle5" name="content5" value="老人與長照/">
      <label for="vehicle5">老人</label>
      <input type="checkbox" id="vehicle6" name="content6" value="醫務/">
      <label for="vehicle6">醫務</label><br>
      <input type="checkbox" id="vehicle7" name="content7" value="法律與政策/">
      <label for="vehicle7">法律與政策</label>
      <input type="checkbox" id="vehicle8" name="content8" value="其他/">
          <label for="vehicle8">其他</label><br>
      
      <p><select name="body1">
      <option value="">入學級別部別</option>
      <option value="110日間部">110日間部</option>
      <option value="110進修部">110進修部</option>
      <option value="109日間部">109日間部</option>
      <option value="109進修部">109進修部</option>
      <option value="108日間部">108日間部</option>
      <option value="108進修部">108進修部</option>
      <option value="107日間部">107日間部</option>
      <option value="107進修部">107進修部</option>
      <option value="106日間部">106日間部</option>
      <option value="106進修部">106進修部</option>
      <option value="105日間部">105日間部</option>
      <option value="105進修部">105進修部</option>
      <option value="104日間部">104日間部</option>
      <option value="104進修部">104進修部</option>
    </select></p>
    <p><select name="body2">
    <option value="">實習期間</option>
    <option value="實習一">實習一</option>
    <option value="實習二">實習二</option>
    <option value="畢業專題">畢業專題</option>
    <option value="其他">其他</option>
    </select></p>
      <p>檔案上傳(僅限pdf!!!): <input type="file" name="file" accept="pdf"/></p>
      <p><input type="submit" value="修改"></p>
    </form>
  </body>
  `)
}


export function show(post) {
  return layout(post.title, `
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <body>
    <h1>機構名稱：${post.title} </h1>
    <p>類別：${post.content}</p>
    <p>作者：${post.username}</p>
    <p>給學弟妹的建議：${post.body}</p>
    
  </body>
  </head>
  </html>
  `)
}

export function mechanism(posts, user) {
  let list = []
  var color_choose = 1;
  var color
  for (let post of posts) {
    if(color_choose%2==0)
    color="#b0dfda"
    else if(color_choose%2==1)
    color="#eecbe7"
    

    list.push(`
   
    <li style="background:${color}; margin:10px">
    <p>${post.title}<a style="padding: 0" href="/delpost/${post.id}">刪除貼文</a><a style="padding: 0" href="/editpost/${post.id}">編輯貼文</a></p>
    <p>作者：${post.username}</p>
    <p>入學級別與實習時間：${post.body}</p>
    <p>類別：${post.content}</p>
    <p><a padding: 0 href="/images/${post.file}">查看資料</a></p>
    </li>
    `)
    color_choose=color_choose+1;
  }

  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a> 
  <form action="/list_custom" method="post">
  
  <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
  <input type="submit" value="搜尋">
 
  <div class="tooltip">游標移過來
  <span class="tooltiptext">搜尋說明：如果要搜尋"松柏園"。關鍵字打"松"或"柏""園"都可以出來歐</span>
</div>
<p>進階搜尋</p>
<input type="checkbox" id="vehicle1" name="title" value="title">
<label for="vehicle1">機構名稱</label>
<input type="checkbox" id="vehicle2" name="class" value="class">
<label for="vehicle1">級別</label>
<input type="checkbox" id="vehicle3" name="content" value="content">
<label for="vehicle1">文章類別</label>
</form></p>
  <ul id="posts" >
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('金大社工系學習歷程專區', content,user)
}
