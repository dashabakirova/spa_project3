<template>
  <v-container>
    <v-row class="mb-1">
      <!-- фильтр по дате -->
      <v-col cols="12" sm="6" md="1" align-self="center">
        Отказы за период
      </v-col>
      <v-col cols="12" sm="6" md="1" align-self="center">
        <v-menu
          ref="menuDateFilter1"
          v-model="menuDateFilter1"
          :close-on-content-click="false"
          :return-value.sync="dateFilter1"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFilter1"
              label="С"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateFilter1"
            no-title
            scrollable
            locale="ru-RU"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuDateFilter1 = false">
              Закрыть
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menuDateFilter1.save(dateFilter1)"
            >
              Ок
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="1" align-self="center">
        <v-menu
          ref="menuDateFilter2"
          v-model="menuDateFilter2"
          :close-on-content-click="false"
          :return-value.sync="dateFilter2"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFilter2"
              label="По"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateFilter2"
            no-title
            scrollable
            locale="ru-RU"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuDateFilter2 = false">
              Закрыть
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menuDateFilter2.save(dateFilter2)"
            >
              Oк
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <!-- фильтр по филиалу -->
      <v-col cols="12" sm="6" md="1" align-self="center"> Филиал </v-col>
      <v-col cols="12" sm="6" md="2" align-self="center">
        <v-select
          :items="siknFailures"
          item-text="NUNAME"
          label="Филиал"
          v-model="nunameFilter"
        ></v-select>
      </v-col>
      <!-- фильтр по продукту -->
      <v-col cols="12" sm="6" md="1" align-self="center"> Продукт </v-col>
      <v-col cols="12" sm="6" md="2" align-self="center">
        <v-select
          :items="siknFailures"
          item-text="PRODUCT"
          label="Продукт"
          v-model="productFilter"
        >
          <template slot="selection" slot-scope="{ item }">
            {{
              item.PRODUCT === "neft"
                ? "Нефть"
                : item.PRODUCT === "np"
                ? "Нефтепродукт"
                : "СИКН Нефтебазы"
            }}
          </template>
          <template slot="item" slot-scope="{ item }">
            {{
              item.PRODUCT === "neft"
                ? "Нефть"
                : item.PRODUCT === "np"
                ? "Нефтепродукт"
                : "СИКН Нефтебазы"
            }}
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="2" align-self="center">
        <v-btn color="warning" text @click="getSiknFailuresFiltered()"
          >Поиск</v-btn
        >
        <v-btn color="warning" text @click="resetFilters()"
          >Отменить выбор</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mb-1">
      <!-- <v-spacer></v-spacer> -->
      <v-col cols="12" sm="6" md="3" align-self="center">
        <v-btn class="warning mb-4" @click="openSvedeniya()"
          >Сведения о метологических отказах</v-btn
        >
      </v-col>
      <v-col cols="12" sm="6" md="1" align-self="center">
        <v-btn
          class="warning mb-4"
          :to="{
            name: 'NewFail',
            params: { id: '-1', nunameFilter: this.nunameFilter },
          }"
          v-if="showAddButton"
          >Добавить
        </v-btn>
      </v-col>
    </v-row>
    <!-- :to="'/newfail/' + '-1'" -->
    <v-divider></v-divider>

    <v-simple-table v-if="show">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">Ред.</th>
            <!-- <th class="text-left">ID</th> -->
            <th class="text-left">Филиал</th>
            <th class="text-left">Наименование ПСП(НПС)</th>
            <th class="text-left">Наименование СИКН (ОСИКН, БИКо)</th>
            <th class="text-left">Владелец СИКН (ОСИКН, БИКо)</th>
            <!-- <th class="text-left">Продукт</th> -->
            <th class="text-left">Дата отказа</th>
            <th class="text-left">Время отказа</th>
            <th class="text-left">ФИО, должность лица выявившего отказ</th>
            <th class="text-left">Остановка приема-сдачи</th>
            <th class="text-left">Перевод на резервную схему учета</th>
            <th class="text-left">Причина отказа по донесению</th>
            <th class="text-left">Дата устранения</th>
            <th class="text-left">Время устранения</th>
            <th class="text-left">Акт расследования</th>
            <th class="text-left">Причина отказа по акту</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in siknFailures" :key="item.RECID">
            <td>
              <v-btn icon :to="'/fail/' + item.RECID">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- <router-link :to="'/fail/' + item.RECID">Edit</router-link> -->
            </td>
            <!-- <td>{{ item.SPR_RECID }}</td> -->
            <td>{{ item.NUNAME }}</td>
            <td>{{ item.PSPNAME }}</td>
            <td>{{ item.NSIKN }}</td>
            <td>{{ item.PSPOWNER }}</td>
            <!-- <td>
              {{
                item.PRODUCT === "neft"
                  ? "Нефть"
                  : item.PRODUCT === "np"
                  ? "Нефтепродукт"
                  : "СИКН Нефтебазы"
              }}
            </td> -->
            <td>{{ item.DATEOTK }}</td>
            <td>{{ item.TIMEOTK }}</td>
            <td>{{ item.FIO_DET_OTK }}</td>
            <td>
              {{ item.PROSTANOVKI === 0 ? "Без остановки" : "С остановкой" }}
            </td>
            <td>{{ item.PRPEREVODNAREZERV === 0 ? "Нет" : "Да" }}</td>
            <td>{{ item.PRICHD }}</td>
            <td>{{ item.DATEUSTR }}</td>
            <td>{{ item.TIMEUSTR }}</td>
            <td>{{ item.AKT }}</td>
            <td>{{ item.PRICHA }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-simple-table v-else>
      <template>
        <thead>
          <tr>
            <th class="text-center">Ред.</th>
            <!-- <th class="text-left">ID</th> -->
            <th class="text-left">Филиал</th>
            <th class="text-left">Наименование ПСП(НПС)</th>
            <th class="text-left">Наименование СИКН (ОСИКН, БИКо)</th>
            <th class="text-left">Владелец СИКН (ОСИКН, БИКо)</th>
            <!-- <th class="text-left">Продукт</th> -->
            <th class="text-left">Дата отказа</th>
            <th class="text-left">Время отказа</th>
            <th class="text-left">Остановка приема-сдачи</th>
            <th class="text-left">Перевод на резервную схему учета</th>
            <th class="text-left">Причина отказа по донесению</th>
            <th class="text-left">Дата устранения</th>
            <th class="text-left">Время устранения</th>
            <th class="text-left">Акт расследования</th>
            <th class="text-left">Причина отказа по акту</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in siknFailuresFiltered" :key="item.RECID">
            <td>
              <v-btn icon :to="'/fail/' + item.RECID">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- <router-link :to="'/fail/' + item.RECID">Edit</router-link> -->
            </td>
            <!-- <td>{{ item.RECID }}</td> -->
            <td>{{ item.NUNAME }}</td>
            <td>{{ item.PSPNAME }}</td>
            <td>{{ item.NSIKN }}</td>
            <td>{{ item.PSPOWNER }}</td>
            <!-- <td>
              {{
                item.PRODUCT === "neft"
                  ? "Нефть"
                  : item.PRODUCT === "np"
                  ? "Нефтепродукт"
                  : "СИКН Нефтебазы"
              }}
            </td> -->
            <td>{{ item.DATEOTK }}</td>
            <td>{{ item.TIMEOTK }}</td>
            <td>
              {{ item.PROSTANOVKI === 0 ? "Без остановки" : "С остановкой" }}
            </td>
            <td>{{ item.PRPEREVODNAREZERV === 0 ? "Нет" : "Да" }}</td>
            <td>{{ item.PRICHD }}</td>
            <td>{{ item.DATEUSTR }}</td>
            <td>{{ item.TIMEUSTR }}</td>
            <td>{{ item.AKT }}</td>
            <td>{{ item.PRICHA }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "SiknFailures",

  data: () => ({
    siknFailures: [],
    siknFailuresFiltered: [],
    show: true,
    showAddButton: false,
    dateFilter1: null,
    dateFilter2: null,
    dateFilter1str: null,
    dateFilter2str: null,
    nunameFilter: null,
    productFilter: null,
    menuDateFilter1: false,
    menuDateFilter2: false,
    filterNumber: null,
  }),

  async mounted() {
    await this.getSiknFailures();
  },

  methods: {
    // получение данных из таблицы sikn_otkaz
    async getSiknFailures() {
      const { data } = await axios.get(
        "/ords/remont/PKG_SIKN_FAILURES.getSiknFailures"
      );
      if (data.status) {
        this.siknFailures = data.result;
      }
    },
    // снятие фильтров
    resetFilters() {
      this.dateFilter1 = null;
      this.dateFilter2 = null;
      this.nunameFilter = null;
      this.productFilter = null;
      this.show = !this.show;
      this.showAddButton = !this.showAddButton;
    },
    // получение отфильтрованной таблицы sikn_otkaz
    async getSiknFailuresFiltered() {
      if (this.dateFilter1 != null && this.dateFilter2 != null) {
        if (this.nunameFilter != null) {
          if (this.productFilter != null) {
            this.filterNumber = 7;
            this.dateFilter1str = this.dateFilter1.split("-").join("");
            this.dateFilter2str = this.dateFilter2.split("-").join("");
            this.showAddButton = !this.showAddButton;
          } else {
            this.filterNumber = 6;
            this.dateFilter1str = this.dateFilter1.split("-").join("");
            this.dateFilter2str = this.dateFilter2.split("-").join("");
            this.showAddButton = !this.showAddButton;
          }
        } else {
          if (this.productFilter != null) {
            this.filterNumber = 5;
            this.dateFilter1str = this.dateFilter1.split("-").join("");
            this.dateFilter2str = this.dateFilter2.split("-").join("");
          } else {
            this.filterNumber = 4;
            this.dateFilter1str = this.dateFilter1.split("-").join("");
            this.dateFilter2str = this.dateFilter2.split("-").join("");
          }
        }
      } else {
        if (this.nunameFilter === null) {
          if (this.productFilter === null) {
            console.log("Фильтры не выбраны");
          } else {
            this.showAddButton = !this.showAddButton;
          }
        } else {
          if (this.productFilter === null) {
            this.filterNumber = 2;
            this.showAddButton = !this.showAddButton;
          } else {
            this.filterNumber = 3;
            this.showAddButton = !this.showAddButton;
          }
        }
      }

      try {
        const { data } = await axios.get(
          "/ords/remont/PKG_SIKN_FAILURES.getSiknFailuresFiltered",
          {
            params: {
              pDateotk1: this.dateFilter1str,
              pDateotk2: this.dateFilter2str,
              pNuname: this.nunameFilter,
              pProduct: this.productFilter,
              pFilterNum: this.filterNumber,
            },
          }
        );
        if (data.status) {
          this.siknFailuresFiltered = data.result;
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error);
      }
      this.show = !this.show;
    },
    // функция для преобразования даты к формату YYYY-MM-DD
    parseDate(date) {
      const parsedDate = date.split(".").reverse().join("-");
      return parsedDate;
    },
    openSvedeniya() {
      window.location.href =
        "http://vus01-piwls--03.ufa.tn.corp:7003/remont-app/Controller?action=remont.makeexternaldocument&procName=otchetsiknexcel&pdnach=" +
        this.dateFilter1.split("-").reverse().join(".") +
        "&pdend=" +
        this.dateFilter2.split("-").reverse().join(".");
      console.log(this.dateFilter1);
    },
  },
};
</script>

<style scoped>
</style>