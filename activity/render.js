export function layout(title, content) {
if(title=="學習歷程檔案登入")
{
  return `
  <html>
  <head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <link rel="stylesheet" href="images/css/slick.css">
    <link rel="stylesheet" href="images/css/slick-theme.css">
    <style>

    /*slider*/
    html, body {
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
    }

    .slider {
        width: 50%;
        margin: 20px;
    }

    .slick-slide {
      margin: 20px 20px;
    }

    

    .slick-prev:before,
    .slick-next:before {
      color: black;
    }


    .slick-slide {
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
    ul {
      
    }
    
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

    body {
      
      background-color:  #D1E9E9;
        font-family: Arial, Helvetica, sans-serif;
        font: 20px Helvetica, Arial;
      }


 

     


/*大小設定*/
        @media (min-width:500px){ 
          .see{display:inline}
          .small{width: 10px;}
          .nosee{display: none}
          .dropbtn1{display:none}}
          
          @media (min-width:1000px){
            .small{width: auto;}
          .nosee{display:inline}
          .dropbtn1{display:inline-block}
        }

       

    </style>
  </head>
 
  ${content}
 
  </html>
  `
}


else
{
  return `
  <html>
  <head>
  
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <style>
    /*登入textarea*/
    input[type=text],input[type=password],
    textarea {
      border: 1px solid #eee;
      border-radius: 2px;
      padding: 15px;
      font-size: .8em;
    }
    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 1px dotted red;
  }
  
  .tooltip .tooltiptext {
      visibility: hidden;
      width: 120px;
      background-color: red;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
  
      /* 定位 */
      position: absolute;
      z-index: 1;
  }
  
  .tooltip:hover .tooltiptext {
      visibility: visible;
  }


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
    

    .formloginright
    {
      position: absolute;
      background-color: #FFC1E0 ;
      width:400px;
      height:400px;
      padding:30px;
      text-align: center;
      display:inline-block;
      border-radius:999em;
      top: 25%;
      left: 55%;
      
     
      
    }

    .formloginleft
    {
      position: absolute;
      background-color: #FFC1E0 ;
      padding:30px;
      width:400px;
      height:400px;
      border-radius:999em;
      text-align: center;
      display: inline-block;
      top: 25%;
      left:20%; 
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
  
     
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],input[type=password],
      textarea {
        border: 1px solid #eee;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text],input[type=password] {
        width: 500px;
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
export function loginUi(args={})  {
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

  <ul style="list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #38444d;">
  <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#">關於機構</a>
      <a href="#">畢業專題</a>
      <a href="#">實習報告書</a>
      <a href="#">聯絡我們</a>
    </div>
    
    <span class="see" style="font-size:30px;float:left;cursor:pointer" onclick="openNav()">&#9776; </span>
    
  <li class="nosee"><a href="#home">回首頁</a></li>
  
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn dropbtn1">關於機構</a>
    <div class="dropdown-content">
      <a href="#">依地區</a>
      <a href="#">依領域</a>
      <a href="#">查看所有機構</a>
    </div>
  </li>
  <li class="nosee"><a href="#news">畢業專題</a></li>
  <li class="nosee"><a href="#news">實習報告書</a></li>
  <li class="nosee"><a href="#news">聯絡我們</a></li>
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn dropbtn1">常見問題</a>
    <div class="dropdown-content">
      <a href="#">忘記密碼</a>
      <a href="#">Q2</a>
      <a href="#">Q3</a>
    </div>
  </li>
  <li style="float:right"><a class="active" href="#about">登入</a></li>
</ul>


 
    <div class="container">
    <div>
      <div class="image">
        <img class="small" style="display:block; margin:auto;" src="images/1.jpg" />
      </div>
    </div>
    <div>
      <div class="image">
        <img class="small" style="display:block; margin:auto;" src="images/1.jpg" />
      </div>
    </div>
    <div>
      <div class="image">
        <img class="small" style="display:block; margin:auto;" src="images/1.jpg" />
      </div>
    </div>
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
  autoplaySpeed: 5000,
});
</script>

    <script>
    function openNav() {
      document.getElementById("mySidenav").style.width = "150px";
    }
    
    function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    }
    </script>
  </body>
  `)
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
    <p><input type="text" placeholder="帳號" name="username"></p>
    <p><input type="password" placeholder="密碼" name="password"></p>
    <p><input type="text" placeholder="手機號碼" name="email"></p>
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
    <p><input type="text" placeholder="學號" name="username"></p>
    <p><input type="password" placeholder="密碼" name="password"></p>
    <p><input type="text" placeholder="入學級別和姓名(例如:108級王曉明)/老師姓名與職位(例如:黃大銘教授)" name="email"></p>
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
    <p>帳號：${user.username}</p>
      <p>密碼：${user.password}</p>
      <p>級別姓名：${user.email}</p>
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

  return layout(user.email+'正在修改密碼', `
 
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
  return layout("正在編輯"+user.email, `
 
<body>
${alertScript}
  <h1>編輯中</h1>
  <form action="/editpassword_user_for_root/${user.id}"  method="post">
  <p>變更帳號：<input type="text" placeholder="帳號" name="account" value="${user.username}"></p>
  <p>變更密碼：<input type="text" placeholder="密碼" name="password" value="${user.password}"></p>
  <p>變更姓名及級別<input type="text" placeholder="名稱" name="username" value="${user.email}"></p>
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
  <p><input type="text" placeholder="使用者帳號" name="account" value="${user.username}"></p>
  <p><input type="text" placeholder="使用者密碼" name="password" value="${user.password}"></p>
    <p><input type="submit" value="修改"></p>
  </form>
  </body>
  `)
}


export function success() {
  return layout('Success', `
  <h1>Success!</h1>
  You may <a href="/">read all Post</a> again !
  `)
}

export function fail() {
  return layout('Fail', `
  <h1>請重新登入</h1>
  You may <a href="/">read all Post</a> or <a href="JavaScript:window.history.back()">go back</a> !
  `)
}

export function list(posts, user) {
 
  
  let list = []
  //    <p><a href="/post/${post.id}">查看完整內容</a></p>
  for (let post of posts) {
    
    list.push(`
   
    <li style="border-color: blue">
    <h2>機構名稱：${ post.title}<a href="/delpost/${post.id}">刪除貼文</a><a href="/editpost/${post.id}">編輯貼文</a></h2>
    <p>類別：${post.content}</p>
    <p>作者：${post.username}</p>
    <p>入學級別與實習時間：${post.body}</p>
    <p><a href="/images/${post.file}">查看資料</a></p>
    </li>
    `)
  }

  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a> 
  <form action="/list_custom" method="post">
  
  <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
  <input type="submit" value="搜尋">
 
  <div class="tooltip">游標移過來
  <span class="tooltiptext">搜尋說明：</span>
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
  return layout('金大社工系學習歷程專區', content)
}



export function liststu(posts, user) {
  let list = []
  for (let post of posts) {
    
    list.push(`
   
    <li style="border-color: blue">
    <h2>機構名稱：${ post.title}</h2>
    <p>類別：${post.content}</p>
    <p>作者：${post.username}</p>
    <p>入學級別與實習時間：${post.body}</p>
    <p><a href="/images/${post.file}">查看資料</a></p>
      </li>
    `)
  }
  let content = `
  
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user.email}<a href="/editpassword_user/${user.id}">變更密碼</a><a href="/logout">登出</a></p>
  <form action="/list_custom_stu" method="post">
  
  <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
  <input type="submit" value="搜尋">
  <div class="tooltip">游標移過來
  <span class="tooltiptext">搜尋說明</span>
  
</div>
<p>進階搜尋</p>
<input type="checkbox" id="vehicle1" name="title" value="title">
  <label for="vehicle1">機構名稱</label>

  <input type="checkbox" id="vehicle2" name="body" value="body">
  <label for="vehicle2">級別</label>

  <input type="checkbox" id="vehicle3" name="content" value="content">
  <label for="vehicle3">文章類別</label>

  <input type="checkbox" id="vehicle4" name="username" value="username">
  <label for="vehicle4">作者姓名</label>

</form>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('金大社工系學習歷程專區', content)
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
