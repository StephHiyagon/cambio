const state = {
  change:null,
}

angular.module("employeeApp", [])
    .controller("employeeController", function($scope, employeeService){

        $scope.editIndex = -1;
        $scope.editObject =   {
            firstName: "",
            lastName: "",
            from: {city: "", state:""},
            phone: "",
            email: "",
            jobTitle: "",
            jobDesc: ""
        };

        $scope.employeeArray = employeeService.getStaffArray();


        //edit button click
        $scope.editingPerson = function(personIndex){
            $scope.editObject = angular.copy($scope.employeeArray[personIndex]);
          /*
          *WHY COPY???
          Because, I wont to seperate the edits from the origanal array. Doing this allows the user to cancel their edit and since the fields are not data-binded to the origanl array, it won't make anychanges.
          */
            $scope.editIndex = personIndex;
        };

        //cancelEdit
        $scope.cancelEdit = function(){
            $scope.editIndex = -1;

        };

        //saveEdit
        $scope.saveEdit = function(personIndex){
            employeeService.updateInfo(personIndex, $scope.editObject);
            $scope.editIndex = -1;
        }
    });

angular.module("employeeApp")
    .service("employeeService", function(){


        //datos casa de cambio
        var staffArray = [
            {
                firstName: "Paulo",
                lastName: "Balarezo",
                from: {city: "Lima", state:"Lima"},
                phone: "999-999-999",
                email: "paulo@gmail.com",
                jobTitle: "Casa de Cambio",
                jobDesc: "Si cambias más de mil dólares te damos una tasa preferencial"
            }

        ];

        this.getStaffArray = function(){
            return staffArray;
        };

        //updating person
        this.updateInfo = function(personIndex, obj){
            staffArray.splice(personIndex, 1, obj)
        }
    });


$('#fileUpload').on('change',function(event){
  var inputFile = $('#fileUpload').val();
  console.log(inputFile);
  var file = event.target.files[0];
  console.log(file);
  var reader = new FileReader();
  reader.onload = function(event) {
  $('.avatar').removeClass('open').css('background-image','url('+event.target.result+')');
  }
  reader.readAsDataURL(file);

});
$('.avatar').on('click',function(){
  console.log('entre');
  $(this).addClass('open');

});
// added code to close the modal if you click outside
$('html').click(function() {
 $('.avatar').removeClass('open');
});

$('.avatar').click(function(event){
    event.stopPropagation();
});


//agregar status

var initPermissionRootState = function(item){
  var body = $("#permissionsBody");
  var rowCount    = body.find("tr").length;
  var perm        = item.attr("data-perm");
  var selectCount = body.find("[data-perm=" + perm + "].active").length;

  if(rowCount == selectCount){
    $("#" + perm).removeClass("multi").addClass("active");
  }else if(selectCount > 0){
    $("#" + perm).removeClass("active").addClass("multi");
  }else{
    $("#" + perm).removeClass("active").removeClass("multi");
  }
}
$("#permissionWrapper").on("click", "#addUser", function(){
  var template = '<tr class="addState">' +
                   '<td><span class="iconUser"></span><span contenteditable="true" class="userName"></span></td>' +
                   '<td><div class="permissionTag active" data-perm="view">En Progreso</div></td>' +
                   '<td><div class="permissionTag" data-perm="delete">Cambiando</div></td>' +
                   '<td><div class="permissionTag" data-perm="admin">Finalizado</div></td>' +
                   '<td><a href="#" class="iconRemove deleteUser" title="Remove this user"></a></td>' +
                 '</tr>';
  var user = $(template);
  $("#permissionsBody").prepend(user);

  setTimeout(function(){
    user.removeClass("addState");
  }, 50);

  initPermissionRootState(user.find("[data-perm=view]"));
  initPermissionRootState(user.find("[data-perm=edit]"));
  initPermissionRootState(user.find("[data-perm=delete]"));
  initPermissionRootState(user.find("[data-perm=owner]"));
  initPermissionRootState(user.find("[data-perm=admin]"));

  user.find(".userName").trigger("focus");
  return false;
});
$("#permissionsBody").on("focusin", ".userName", function(){
  $(this).parent().parent().addClass("focused");
}).on("focusout", ".userName", function(){
  $(this).parent().parent().removeClass("focused");
}).on("click", ".deleteUser", function(e){
  e.preventDefault();
  var parent = $(this).parent().parent();
  parent.addClass("removeState");
  setTimeout(function(){
    parent.remove();
  }, 400);
});
// trigger root permission state
$("#permissionWrapper").on("click", ".permissionTag", function(){
  var me   = $(this);

  if(me.hasClass("active")){
    me.removeClass("active");
  }else{
    me.addClass("active");
  }

  initPermissionRootState(me);
});
// bind root permission state click and init
$("#permissionsHead").on("click", ".permissionTag", function(){
  var me   = $(this);
  var perm = me.attr("data-perm");
  var body = $("#permissionsBody");

  if(me.hasClass("active")){
    me.removeClass("active");
    body.find("[data-perm=" + perm + "].active:visible").trigger("click");
  }else{
    me.removeClass("multi");
    body.find("[data-perm=" + perm + "]:not(.active):visible").trigger("click");
  }

}).find(".permissionTag").each(function(i, e){
  initPermissionRootState($(e));
})

// init filter inputs --------------------------------------------------------------------
$("#permissionWrapper").on("keyup", ".listFilterInput", function(){
  var me    = $(this);
  var val   = $.trim(me.val());
  var items = $("#" + me.attr("id").replace("input", "list")).find("tr");

  if(val.length > 0){
    var item = null;

    $.each(items, function(i, e){
      item = $(e);
      if(!item.hasClass("doNotFilter")){
        (item.text().toUpperCase().indexOf(val.toUpperCase()) >= 0) ? item.show()
        : item.hide();
      }
    });
  }else{
    items.show();
  }
});

//login
const soloLetras = (e)=>{
	let code = e.which;

	if((code>=97 && code<=122) ||(code>=65 && code<=90) || code==39 || code==32 || code==241 || code==209){
		return true;
	}else{
		return false;
	}
};

let validateNombre,validatePassword;
$('#login__username').on({
  keypress: soloLetras,
  keyup: (e)=>{
    if($(e.target).val().length > 1 ){
      validateNombre = true;
    }else{
      validateNombre = false;
    }
  }
});

$('#login__password').on("keyup", (e)=>{
  if($(e.target).val().length >= 6){
    validatePassword = true;

  }else{
    validatePassword = false;

  }
});

$('#enviar').on('click',function(e){
  e.preventDefault();
  console.log('otra pagina');
  if(($('#login__username').val().toLowerCase() == "paulo") ||($('#login__username').val().toLowerCase() == "martin") && $('#login__password').val()=="123456"){
    window.location.href = "perfil.html";
  }else{
    $('#error').show();
  }
});

$('.logout').on('click',function(){
  window.location.href = "index.html";
});

//fecha y hora

let hoy = new Date(),
      diaA = hoy.getDate(),
      mesA = hoy.getMonth()+1, //hoy es 0!
      anioA = hoy.getFullYear(),
      dia=hoy.getDay();
  let semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  let meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  console.log(dia);

$(function(){
  var cambiaHora=function(){
      // console.log('actualiza');
      let hoy = new Date(),
          diaA = hoy.getDate(),
          mesA = hoy.getMonth()+1, //hoy es 0!
          anioA = hoy.getFullYear(),
          dia=hoy.getDay();
      let semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
      let meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      console.log(dia);
      let hour= hoy.getHours();
      let minutes= hoy.getMinutes();
      var seconds= hoy.getSeconds();
      console.log(hoy.getHours());
      let veintitres = 23;
      let sesenta=60;
      let hourPerScreen= veintitres - hour;
      let minutesPerScreen=sesenta - minutes;
      let secondsPerScreen=sesenta - seconds;
      if(hour==00){
        console.log('cambia tasa');
        $.get('https://openexchangerates.org/api/latest.json?app_id=435a26ff399e4d9a8c2f9b648d355a7a', (data) => {

              if (!data) { return alert('no hay data gg');}

              state.change = data.rates.PEN;
              console.log(state.change);

            });
      }
      document.getElementById('hora').innerHTML=hourPerScreen+':'+minutesPerScreen+':'+secondsPerScreen;
    };
    cambiaHora();
    var intervalo = setInterval(cambiaHora,1000);
});


  $('#fecha').text(' '+semana[dia]+', '+diaA+' de '+meses[mesA -1]+' de '+anioA);



//conversor

$('#convierte').on('click',function(){
  console.log('entre');
  var monto=$('#soles').val();
  console.log(soles);
  console.log($('.divisasInput').val());
  if($('.divisasInput').val()=='usd'){
    $('.moneda').text('soles');
    $('.result').show();
    $('.recibo').text((monto*(state.change).toFixed(4)));
    console.log('cambia dolar');
  }else{
    $('.moneda').text('doláres');
    $('.result').show();
    $('.recibo').text((monto*(3.29).toFixed(4)));

  }
})


//comunicacion con api para tipo de cambio- plan free solo permite cambio de dólares a otra divisa(165)

$(_=>{

$.get('https://openexchangerates.org/api/latest.json?app_id=435a26ff399e4d9a8c2f9b648d355a7a', (data) => {

      if (!data) { return alert('no hay data gg');}

      state.change = data.rates.PEN;
      console.log(state.change);
      $('.soles').text('"'+((state.change).toFixed(4))+'"');
    });
});
