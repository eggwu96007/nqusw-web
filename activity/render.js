export function layout(title, content) {
  return `
  <html>
  <head>
  
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <style>
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

  <div class="formloginleft">
  <h1>管理員登入</h1>
  
  <form action="/login" method="post" >
    <p><input type="text" placeholder="帳號"  name="username" style="width:auto;"></p>
    <p><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
    <p><input type="submit" value="登入"></p>
  </form>
 <p>${alertScript}</p>

 </div>

 <div class="formloginright">
 <h1>學生端登入</h1>
  
 <form action="/loginstu" method="post" >
   <p><input type="text" placeholder="帳號"  name="username" style="width:auto;"></p>
   <p><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
   <p><input type="submit" value="登入"></p>
 </form>
<p>${alertScriptstu}</p>
</div>
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
  <p><a href="/signup_student">新增使用者帳號</a><a href="/signup_teacher">新增管理員帳號</a></p>
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
  /*console.log("下午開始",posts)
  console.log("剛開始要看這個1",posts[0][0])
  console.log("剛開始要看這個2",posts[1][0])
  console.log("剛開始要看這個3",posts[2])*/
  //console.log("剛開始要看這個",posts[0][0])
  //console.log("剛開始要看這個",posts)
  
  let list = []
  //    <p><a href="/post/${post.id}">查看完整內容</a></p>
  for (let post of posts) {
    
    list.push(`
   
    <li style="border-color: blue">
    <h2>機構名稱：${ post.title}<a href="/delpost/${post.id}">刪除貼文</a><a href="/editpost/${post.id}">編輯貼文</a></h2>
    <p>類別：${post.content}</p>
    <p>作者：${post.username}</p>
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
    <p><a href="/images/${post.file}">查看資料</a></p>
      </li>
    `)
  }
  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user}<a href="/editpassword_user/${user.id}">變更密碼</a><a href="/logout">登出</a></p>
  <form action="/list_custom_stu" method="post">
  
  <input type="text" placeholder="關鍵字搜尋"  name="search" style="width:auto;">
  <input type="submit" value="搜尋">
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
      <p><input type="text" placeholder="入學級別和姓名(例如:108級王曉明)/老師姓名與職位(例如:黃大銘教授)" name="author"></p>
      
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

      <p><textarea placeholder="心得或給學弟妹的建議(不可使用特殊符號：如${"[@`#$%^&*_+<>{}\/[\]])"}" name="body"></textarea></p>
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
      <p><input type="text" placeholder="入學級別和姓名(例如:108級王曉明)/老師姓名與職位(例如:黃大銘教授)" name="author" value="${post.username}"></p>
      
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

      <p><textarea placeholder="心得或給學弟妹的建議(不可使用特殊符號：如${"[@`#$%^&*_+<>{}\/[\]])"}" name="body" >${post.body}</textarea></p>
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
