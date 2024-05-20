"use strict";

var menu = window.document.querySelector("#menu");
var modalCarrinho = window.document.querySelector("#modal-carrinho");
var btnAbrirCarrinho = window.document.querySelector("#carrinho-btn");
var btnFecharModal = window.document.querySelector("#btn-fechar-modal");
var listaItensComprados = window.document.querySelector("#carrinho-itens");
var totalCompra = window.document.querySelector("#carrinho-total");
var btnCheckout = window.document.querySelector("#botao-checkout");
var contagemItens = window.document.querySelector("#cart-count");
var inputEndereco = window.document.querySelector("#endereco");
var enderecoAlerta = window.document.querySelector("#alerta-endereco");
var btnRemoverItemCarrinho = window.document.querySelector(".btn-remove-do-carrinho");
var horarioFuncionamento = window.document.querySelector("#date-span");
var itensCarrinho = [];
var total = 0;

function mostrarModalCarrinho() {
  modalCarrinho.classList.remove("hidden");
  modalCarrinho.classList.add("flex");
  atualizaCarrinhoModal();
}

function esconderModalCarrinho() {
  modalCarrinho.classList.remove("flex");
  modalCarrinho.classList.add("hidden");
} //Funcao pra add pro carrinho


function addParaCarrinho(nomeItem, valor) {
  //alert("Voce adicionou " + nomeItem + ". Seu valor é R$" + valor);
  var itemExistente = itensCarrinho.find(function (item) {
    return item.nomeItem === nomeItem;
  });

  if (itemExistente) {
    //Se o item ja existe, icrementa apenas a quantidade
    itemExistente.quantidade = itemExistente.quantidade + 1;
  } else {
    //adiciona o item na lista caso ainda nao exista
    itensCarrinho.push({
      nomeItem: nomeItem,
      valor: valor,
      quantidade: 1
    });
  }

  atualizaCarrinhoModal();
} //Atualiza o carrinho


function atualizaCarrinhoModal() {
  listaItensComprados.innerHTML = "";
  var total = 0;
  itensCarrinho.forEach(function (item) {
    var itemCarrinhoElemento = window.document.createElement("div");
    itemCarrinhoElemento.classList.add("flex", "justify-between", "mb-4", "flex-col"); //cada item ficara no seu canto, margin bottom de 1rem, cada item fica um em baixo do outro

    itemCarrinhoElemento.innerHTML = "\n            <div class=\"flex items-center justify-between\">\n                <div>\n                    <p class=\"font-medium \">".concat(item.nomeItem, "</p>\n                    <p>Qtd.: ").concat(item.quantidade, "</p>\n                    <p class=\"font-medium mt-2\">R$ ").concat(item.valor.toFixed(2), "</p>\n                </div>\n\n                <div>\n                    <button class=\"btn-remove-do-carrinho\" data-name=\"").concat(item.nomeItem, "\">\n                        Remover\n                    </button\n                </div>\n            </div>\n        ");
    total = total + item.quantidade * item.valor;
    totalCompra.innerText = "R$ " + total.toFixed(2);
    listaItensComprados.appendChild(itemCarrinhoElemento);
  });

  if (itensCarrinho.length == 0) {
    totalCompra.innerText = "R$ " + 0.00;
  }

  contagemItens.innerHTML = itensCarrinho.length;
} //Funcao para remover o item do carrinho


function removerItemDoCarrinho(event) {
  if (event.target.classList.contains("btn-remove-do-carrinho")) {
    var nome = event.target.getAttribute("data-name");
    var indice = itensCarrinho.findIndex(function (item) {
      return item.nomeItem = nome;
    });

    if (indice != -1) {
      //item encontrado
      var item = itensCarrinho[indice];

      if (item.quantidade > 1) {
        item.quantidade = item.quantidade - 1;
        atualizaCarrinhoModal();
        return;
      }

      itensCarrinho.splice(indice, 1);
      atualizaCarrinhoModal();
    }
  }
}

btnAbrirCarrinho.addEventListener("click", mostrarModalCarrinho);
btnFecharModal.addEventListener("click", esconderModalCarrinho);
menu.addEventListener("click", function (event) {
  //console.log(event.target);
  var parentButton = event.target.closest(".add-carrinho-btn");

  if (parentButton) {
    //click no botao pra add item ao carrinho
    var nomeItem = parentButton.getAttribute("data-name");
    var precoItem = Number(parentButton.getAttribute("data-price")); //console.log("Voce se interessou pelo ", nomeItem, ". Ele custa R$", precoItem);
    //Add para o carrinho

    addParaCarrinho(nomeItem, precoItem);
  }
});
listaItensComprados.addEventListener("click", function (event) {
  removerItemDoCarrinho(event);
});
inputEndereco.addEventListener("input", function (event) {
  var valorEntrada = event.target.value;

  if (valorEntrada != "") {
    enderecoAlerta.classList.add("hidden");
    inputEndereco.classList.remove("border-red-500");
  }
});
btnCheckout.addEventListener("click", function () {
  if (verSeRestauranteEstaAberto() == false) {
    //restaurante fechado
    Toastify({
      text: "No momento, estamos fechados!",
      duration: 5000,
      close: true,
      gravity: "top",
      // `top` or `bottom`
      position: "right",
      // `left`, `center` or `right`
      stopOnFocus: true,
      // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444"
      },
      onClick: function onClick() {} // Callback after click

    }).showToast();
    return;
  }

  if (itensCarrinho.length === 0) {
    return;
  }

  if (inputEndereco.value === "") {
    enderecoAlerta.classList.remove("hidden");
    inputEndereco.classList.add("border-red-500");
    return;
  }

  var listaItensCarrinho = itensCarrinho.map(function (item) {
    return "".concat(item.nomeItem, "\nQuantidade: (").concat(item.quantidade, ")\nPre\xE7o: R$ ").concat(item.valor.toFixed(2), "\n------------------------\n");
  }).join("");
  var mensagem = encodeURIComponent(listaItensCarrinho);
  var phone = "+5571999580275";
  window.open("https://wa.me/".concat(phone, "?text=").concat(mensagem, " Endere\xE7o ").concat(inputEndereco.value), "_blank");
  itensCarrinho.length = 0;
  atualizaCarrinhoModal();
});

function verSeRestauranteEstaAberto() {
  //verificar a hora e manipular o card do horario
  var data = new Date();
  var hora = data.getHours();
  return hora >= 18 && hora < 22; //horario de funcionamento do restaurante
}

function mudaCorSpanHoraFuncionamento() {
  if (verSeRestauranteEstaAberto() == false) {
    horarioFuncionamento.classList.remove("bg-green-600");
    horarioFuncionamento.classList.add("bg-red-600");
  } else {
    horarioFuncionamento.classList.add("bg-green-600");
    horarioFuncionamento.classList.remove("bg-red-600");
  }
}

document.addEventListener('DOMContentLoaded', mudaCorSpanHoraFuncionamento);
