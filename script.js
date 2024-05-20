const menu = window.document.querySelector("#menu");
const modalCarrinho = window.document.querySelector("#modal-carrinho");
const btnAbrirCarrinho = window.document.querySelector("#carrinho-btn");
const btnFecharModal = window.document.querySelector("#btn-fechar-modal");
const listaItensComprados = window.document.querySelector("#carrinho-itens");
const totalCompra = window.document.querySelector("#carrinho-total");
const btnCheckout = window.document.querySelector("#botao-checkout");
const contagemItens = window.document.querySelector("#cart-count");
const inputEndereco = window.document.querySelector("#endereco");
const enderecoAlerta = window.document.querySelector("#alerta-endereco");
const btnRemoverItemCarrinho = window.document.querySelector(".btn-remove-do-carrinho");
const horarioFuncionamento = window.document.querySelector("#date-span");

let itensCarrinho = [];
let total = 0;

function mostrarModalCarrinho() {

    modalCarrinho.classList.remove("hidden");
    modalCarrinho.classList.add("flex");
    atualizaCarrinhoModal();

}

function esconderModalCarrinho() {

    modalCarrinho.classList.remove("flex");
    modalCarrinho.classList.add("hidden");

}

//Funcao pra add pro carrinho
function addParaCarrinho(nomeItem, valor) {
    //alert("Voce adicionou " + nomeItem + ". Seu valor é R$" + valor);

    const itemExistente = itensCarrinho.find(item => item.nomeItem === nomeItem);

    if (itemExistente) {
        //Se o item ja existe, icrementa apenas a quantidade
        itemExistente.quantidade = itemExistente.quantidade + 1;
    } else {

        //adiciona o item na lista caso ainda nao exista
        itensCarrinho.push({
            nomeItem,
            valor,
            quantidade: 1
        });

    }

    atualizaCarrinhoModal();

}

//Atualiza o carrinho

function atualizaCarrinhoModal() {
    listaItensComprados.innerHTML = "";
    let total = 0;

    itensCarrinho.forEach(item => {
        const itemCarrinhoElemento = window.document.createElement("div");
        itemCarrinhoElemento.classList.add("flex", "justify-between", "mb-4", "flex-col"); //cada item ficara no seu canto, margin bottom de 1rem, cada item fica um em baixo do outro
        itemCarrinhoElemento.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium ">${item.nomeItem}</p>
                    <p>Qtd.: ${item.quantidade}</p>
                    <p class="font-medium mt-2">R$ ${item.valor.toFixed(2)}</p>
                </div>

                <div>
                    <button class="btn-remove-do-carrinho" data-name="${item.nomeItem}">
                        Remover
                    </button
                </div>
            </div>
        `;

        total = total + (item.quantidade * item.valor);
        totalCompra.innerText = "R$ " + total.toFixed(2);

        listaItensComprados.appendChild(itemCarrinhoElemento);
    });

    if (itensCarrinho.length == 0) {
        totalCompra.innerText = "R$ " + 0.00;
    }

    contagemItens.innerHTML = itensCarrinho.length;

}

//Funcao para remover o item do carrinho

function removerItemDoCarrinho(event) {
    if (event.target.classList.contains("btn-remove-do-carrinho")) {
        const nome = event.target.getAttribute("data-name");

        const indice = itensCarrinho.findIndex(item => item.nomeItem = nome);
        if (indice != -1) {
            //item encontrado
            const item = itensCarrinho[indice];
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

    let parentButton = event.target.closest(".add-carrinho-btn");
    if (parentButton) { //click no botao pra add item ao carrinho
        const nomeItem = parentButton.getAttribute("data-name");
        const precoItem = Number(parentButton.getAttribute("data-price"));
        //console.log("Voce se interessou pelo ", nomeItem, ". Ele custa R$", precoItem);

        //Add para o carrinho
        addParaCarrinho(nomeItem, precoItem);

    }
});

listaItensComprados.addEventListener("click", function (event) {
    removerItemDoCarrinho(event)
});

inputEndereco.addEventListener("input", function (event) {
    let valorEntrada = event.target.value;
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
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            onClick: function () {} // Callback after click
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

    const listaItensCarrinho = itensCarrinho.map((item) => {
        return (
            `${item.nomeItem}\nQuantidade: (${item.quantidade})\nPreço: R$ ${item.valor.toFixed(2)}\n------------------------\n`
        )
    }).join("");

    const mensagem = encodeURIComponent(listaItensCarrinho);
    const phone = "+5571999580275";

    window.open(`https://wa.me/${phone}?text=${mensagem} Endereço ${inputEndereco.value}`, "_blank");

    itensCarrinho.length = 0;
    atualizaCarrinhoModal();
});

function verSeRestauranteEstaAberto() {
    //verificar a hora e manipular o card do horario
    const data = new Date();
    const hora = data.getHours();
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
