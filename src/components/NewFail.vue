<template>
  <v-container>
    <v-row class="ml-2 mb-1">
      <v-col cols="12" sm="6" md="3" align-self="center">
        <h2>Новый отказ</h2>
      </v-col>
      <v-col cols="12" sm="6" md="4" align-self="center">
        <v-btn class="warning mr-2 mb-2" :to="'/'">Закрыть</v-btn>
        <v-btn class="warning mr-2 mb-2" @click="addFail()">Сохранить</v-btn>
      </v-col>
    </v-row>

    <v-divider class="mb-6"></v-divider>

    <v-card elevation="2" class="mb-6">
      <v-card-title>Основные данные</v-card-title>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center"> Филиал </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <!-- <v-select
            :items="siknFailures"
            item-text="NUNAME"
            label="Филиал"
            v-model="nunameM"
            readonly
          ></v-select> -->
          <v-text-field
            label="Филиал"
            v-model="nunameM"
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Объект (СИКН, БИК, метеостанция)
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-select
            :items="selectedPspname"
            item-text="PSPNAME"
            label="Объект (СИКН, БИК, метеостанция)"
            v-model="pspnameM"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Дата/время отказа
        </v-col>
        <v-col cols="12" sm="6" md="2" align-self="center">
          <v-menu
            ref="menuDateOtk"
            v-model="menuDateOtk"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Дата"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable locale="ru-RU">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menuDateOtk = false">
                Закрыть
              </v-btn>
              <v-btn text color="primary" @click="$refs.menuDateOtk.save(date)">
                Oк
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="1" align-self="center">
          <v-menu
            ref="menuTimeOtk"
            v-model="menuTimeOtk"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="time"
                label="Время"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimeOtk"
              v-model="time"
              full-width
              @click:minute="$refs.menuTimeOtk.save(time)"
              format="24hr"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          ФИО, должность лица выявившего отказ
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            clearable
            label="ФИО, должность лица выявившего отказ"
            v-model="fioDetOtkM"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Донесение об отказе
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-file-input
            show-size
            :label="reportOtkazNm"
            v-model="fileReportOtkM"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Донесение об отказе направлено на Мониторинг ПСП
        </v-col>
        <v-col cols="12" sm="6" md="4" align-self="center">
          <v-radio-group row v-model="monitoringPspOtkM">
            <v-radio label="Да" :value="1"></v-radio>
            <v-radio label="Нет" :value="2"></v-radio>
            <v-radio label="Не требуется" :value="0"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="2" class="mb-6">
      <v-card-title> Отказ оборудования и последствия </v-card-title>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Наименование отказавшего СИ, оборудования
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            clearable
            label="Наименование отказавшего СИ, оборудования"
            v-model="nameOborM"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Тип СИ, оборудования
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            clearable
            label="Тип СИ, оборудования"
            v-model="tipOborM"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          СИ/оборудование из реестра ОВП
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-radio-group v-model="reestrOvp">
            <v-radio label="Нет" :value="2"></v-radio>
            <v-radio label="Да" :value="1"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Этап работ, на котором обнаружен отказ
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-select
            :items="vidrabItems"
            item-text="KOD"
            label="Этап работ, на котором обнаружен отказ"
            v-model="vidrab"
          >
            <template slot="selection" slot-scope="{ item }">
              {{
                item.KOD === 1
                  ? "Применения"
                  : item.KOD === 2
                  ? "Включение в работу"
                  : "КМХ, ТО"
              }}
            </template>
            <template slot="item" slot-scope="{ item }">
              {{
                item.KOD === 1
                  ? "Применения"
                  : item.KOD === 2
                  ? "Включения в работу"
                  : "КМХ, ТО"
              }}
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Год выпуска СИ, оборудования
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-select
            :items="yearRelease"
            label="Год выпуска СИ, оборудования"
            v-model="yearVipOborM"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Год ввода в эксплуатацию
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-select
            :items="yearRelease"
            label="Год ввода в эксплуатацию"
            v-model="yearVvodOborM"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Заводской номер СИ, оборудования
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            label="Заводской номер СИ, оборудования"
            clearable
            v-model="zavodNumM"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Описание отказа
        </v-col>
        <v-col cols="12" sm="6" md="4" align-self="center">
          <v-textarea
            clearable
            label="Описание отказа"
            v-model="prichdM"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Последствия отказа
        </v-col>
        <v-col cols="12" sm="6" md="4" align-self="center">
          <v-select
            :items="rezultItems"
            item-text="KOD"
            label="Последствия отказа"
            v-model="rezultOtkaz"
          >
            <template slot="selection" slot-scope="{ item }">
              {{
                item.KOD === 1
                  ? "Отказ не повлиял на ведение учетных операций по СИКН"
                  : item.KOD === 2
                  ? "Прекращен учет по СИКН, переход на РСУ"
                  : item.KOD === 3
                  ? "Прекращение учета, сокращение перекачки или остановка МТ"
                  : "Нарушение учетных операций"
              }}
            </template>
            <template slot="item" slot-scope="{ item }">
              {{
                item.KOD === 1
                  ? "Отказ не повлиял на ведение учетных операций по СИКН"
                  : item.KOD === 2
                  ? "Прекращен учет по СИКН, переход на РСУ"
                  : item.KOD === 3
                  ? "Прекращение учета, сокращение перекачки или остановка МТ"
                  : "Нарушение учетных операций"
              }}
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Остановка приема/сдачи
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-radio-group v-model="radioProstanovki">
            <v-radio label="Без остановки" :value="0"></v-radio>
            <v-radio label="С остановкой" :value="1"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Перевод на резервную схему учета
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-radio-group v-model="radioPrperevodnarezerv">
            <v-radio label="Нет" :value="0"></v-radio>
            <v-radio label="Да" :value="1"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="2" class="mb-6">
      <v-card-title> Устранение отказа </v-card-title>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Дата/время устранения</v-col
        >
        <v-col cols="12" sm="6" md="2" align-self="center">
          <v-menu
            ref="menuDateUstr"
            v-model="menuDateUstr"
            :close-on-content-click="false"
            :return-value.sync="dateUstrModel"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateUstrModel"
                label="Дата"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateUstrModel"
              no-title
              scrollable
              locale="ru-RU"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menuDateUstr = false">
                Закрыть
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menuDateUstr.save(dateUstrModel)"
              >
                Oк
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="1" align-self="center">
          <v-menu
            ref="menuTimeUstr"
            v-model="menuTimeUstr"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="timeUstrModel"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="timeUstrModel"
                label="Время"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimeUstr"
              v-model="timeUstrModel"
              full-width
              @click:minute="$refs.menuTimeUstr.save(timeUstrModel)"
              format="24hr"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Донесение об устранении отказа
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-file-input
            show-size
            :label="reportUstrLnk"
            v-model="fileReportUstrM"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Причина отказа по акту</v-col
        >
        <v-col cols="12" sm="6" md="4" align-self="center">
          <v-textarea
            clearable
            clear-icon="mdi-close-circle"
            label="Причина отказа по акту"
            v-model="prichaM"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Донесение об отказе направлено на Мониторинг ПСП
        </v-col>
        <v-col cols="12" sm="6" md="4" align-self="center">
          <v-radio-group row v-model="monitoringPspUstrM">
            <v-radio label="Да" :value="1"></v-radio>
            <v-radio label="Нет" :value="2"></v-radio>
            <v-radio label="Не требуется" :value="0"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Номер акта расследования отказа
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            v-model="aktM"
            label="Номер акта расследования отказа"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Акт расследования отказа
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-file-input
            show-size
            :label="aktLnk"
            v-model="fileAktM"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  props: ['nunameFilter'],
  name: "Fail",
  data: (vm) => ({
    fail: {},
    id: [],
    addId: null,
    date: null,
    dateUstrModel: null,
    time: null,
    timeUstrModel: null,
    menuDateOtk: false,
    menuTimeOtk: false,
    menuDateUstr: false,
    menuTimeUstr: false,
    radioProstanovki: null,
    radioPrperevodnarezerv: null,

    aktM: "",
    prichaM: "",
    prichdM: "",
    nunameM: "",
    pspnameM: "",
    siknM: null,
    fioDetOtkM: "",
    nameOborM: "",
    monitoringPspOtkM: null,
    monitoringPspUstrM: null,
    tipOborM: "",
    yearVipOborM: null,
    yearVvodOborM: null,
    zavodNumM: "",
    rezultOtkaz: null,
    reestrOvp: null,
    vidrab: null,

    fileReportOtkM: null,
    fileReportUstrM: null,
    fileAktM: null,

    reportOtkazLnk: "",
    reportOtkazNm: "",
    reportUstrLnk: "",
    reportUstrNm: "",
    aktLnk: "",
    aktNm: "",

    url: "http://iis.ufa.tn.corp/spprout/sikn/",
    urlFileOtk: "",
    urlFileUstr: "",
    urlFileAkt: "",

    parseDateTimeOtk: null,
    parseDateTimeUstr: null,
    siknFailures: [],
    selectedPspname: [],
    yearRelease: [],
    year: 1950,
    rezultItems: [{ KOD: 1 }, { KOD: 2 }, { KOD: 3 }, { KOD: 4 }],
    vidrabItems: [{ KOD: 1 }, { KOD: 2 }, { KOD: 3 }],
  }),

  async mounted() {
    await this.getSiknFailures();
    for (let i = 0; i < this.siknFailures.length; i++) {
      this.id[i] = this.siknFailures[i].RECID;
    }
    this.setYearItems();   
    this.nunameM = this.nunameFilter; 
  },

  watch: {
    nunameM() {
      this.getPspname();
    },
  },

  methods: {
    // функция получения массива отказов
    async getSiknFailures() {
      const { data } = await axios.get(
        "/ords/remont/PKG_SIKN_FAILURES.getSiknFailures"
      );
      if (data.status) {
        this.siknFailures = data.result;
      }
    },
    // функция для преобразования даты и времени в формат вывода текстового поля
    parseDate(date) {
      const parsedDate = date.split(".").reverse().join("-");
      return parsedDate;
    },
    // функция для добавления и изменения объекта в БД
    async updateFailInTable() {
      if (this.date != null) {
        this.parseDateTimeOtk = this.parseDateTime(this.date, this.time);
      }
      if (this.dateUstrModel != null) {
        this.parseDateTimeUstr = this.parseDateTime(
          this.dateUstrModel,
          this.timeUstrModel
        );
      }

      const fd = new FormData();
      fd.append("pRecid", this.$route.params.id);
      fd.append("pSpr_recid", this.siknM);
      fd.append("pDateotk", this.parseDateTimeOtk);
      fd.append("pProstanovki", this.radioProstanovki);
      fd.append("pPrperevodnarezerv", this.radioPrperevodnarezerv);
      fd.append("pPrichd", this.prichdM || "");
      fd.append("pDateustr", this.parseDateTimeUstr || "");
      fd.append("pAkt", this.aktM || "");
      fd.append("pPricha", this.prichaM || "");
      fd.append("pFio_det_otk", this.fioDetOtkM);
      fd.append("pName_obor", this.nameOborM);
      fd.append("pMonitoring_psp_otkaz", this.monitoringPspOtkM || "");
      fd.append("pMonitoring_psp_ustr", this.monitoringPspUstrM || "");
      fd.append("pTip_obor", this.tipOborM || "");
      fd.append("pReestrovp", this.reestrOvp || "");
      fd.append("pVidrab", this.vidrab || "");
      fd.append("pYear_vip_obor", this.yearVipOborM || "");
      fd.append("pYear_vvod_obor", this.yearVvodOborM || "");
      fd.append("pZavod_number", this.zavodNumM || "");
      fd.append("pRezult_otkaz", this.rezultOtkaz || "");

      await axios
        .post(`/ords/remont/PKG_SIKN_FAILURES.saveFail`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    },
    // функция для преобразования даты и времени в одну строку и формат таблицы
    parseDateTime(date, time) {
      const parsedDateTime =
        date.split("-").join("") + time.split(":").join("") + "00";
      console.log(parsedDateTime);
      return parsedDateTime;
    },
    // функция для получения наименований филиалов по связи с кодом СИКН
    async getPspname() {
      const { data } = await axios.get(
        "/ords/remont/PKG_SIKN_FAILURES.getPspname",
        { params: { pNuname: this.nunameM } }
      );
      if (data.status) {
        this.selectedPspname = data.result;
        this.siknM = data.result[0].NU;
      }
    },
    // функция для создания массива годов выпуска оборудования
    setYearItems() {
      while (this.year < 2200) {
        this.yearRelease.push((this.year++).toString());
      }
    },
    // вспомогательная функция, чтобы файл добавлялся после создания записи в таблице
    async addFail() {
      await this.updateFailInTable();
      console.log(this.fileReportOtkM);
      console.log(this.fileReportUstrM);
      if (this.fileReportOtkM != null) {
        this.uploadFileOtkaz();
      }
      if (this.fileReportUstrM != null) {
        this.uploadFileUstr();
      }
      if (this.fileAktM != null) {
        this.uploadFileAkt();
      }
      router.push("/");
    },
    // функция добавления файла донесения об отказе в таблицу
    async uploadFileOtkaz() {
      const fd = new FormData();
      fd.append("pRecid", Math.max.apply(null, this.id) + 20);
      fd.append("pFile", this.fileReportOtkM);

      await axios
        .post(`/ords/remont/PKG_SIKN_FAILURES.uploadFileOtkaz`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      this.reportOtkazNm = this.fileReportOtkM.name;
    },
    async uploadFileUstr() {
      const fd = new FormData();
      fd.append("pRecid", Math.max.apply(null, this.id) + 20);
      fd.append("pFile", this.fileReportUstrM);

      await axios
        .post(`/ords/remont/PKG_SIKN_FAILURES.uploadFileUstr`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      this.reportUstrNm = this.fileReportUstrM.name;
    },
    async uploadFileAkt() {
      const fd = new FormData();
      fd.append("pRecid", Math.max.apply(null, this.id) + 20);
      fd.append("pFile", this.fileAktM);

      await axios
        .post(`/ords/remont/PKG_SIKN_FAILURES.uploadFileAkt`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      this.aktNm = this.fileAktM.name;
    },
  },
};
</script>

<style>
</style>