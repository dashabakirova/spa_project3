<template>
  <v-container>
    <v-row class="ml-2 mb-1">
      <v-col cols="12" sm="6" md="3" align-self="center">
        <h2>Отказ № {{ $route.params.id }}</h2>
      </v-col>
      <!-- <v-spacer></v-spacer> -->
      <v-col cols="12" sm="6" md="8" align-self="center">
        <v-btn class="warning mr-2 mb-2" :to="'/'">Закрыть</v-btn>
        <v-btn class="warning mr-2 mb-2" @click="deleteFailFromTable()"
          >Удалить</v-btn
        >
        <v-btn class="warning mr-2 mb-2" @click="updateFailInTable()"
          >Сохранить</v-btn
        >
        <v-btn class="warning mr-2 mb-2" @click="openDonesenie()"
          >Донесение об отказе</v-btn
        >
        <v-btn class="warning mr-2 mb-2" @click="openDonesenieUstr()"
          >Донесение об устранении отказа</v-btn
        >
      </v-col>
    </v-row>

    <v-divider class="mb-6"></v-divider>

    <v-card elevation="2" class="mb-6">
      <v-card-title>Основные данные</v-card-title>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center"> Филиал </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            label="Филиал"
            v-model="nunameM"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Объект (СИКН, БИК, метеостанция)
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-text-field
            label="Объект (СИКН, БИК, метеостанция)"
            v-model="pspnameM"
            readonly
          ></v-text-field>
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
            v-model="fileReportOtkM"
            show-size
            :label="reportOtkazNm"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-btn
            v-if="show"
            text
            color="warning"
            :href="urlFileOtk"
            target="_blank"
            >Посмотреть</v-btn
          >
          <v-btn text color="warning" @click="uploadFileOtkaz()"
            >Загрузить</v-btn
          >
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
            v-model="fileReportUstrM"
            show-size
            :label="reportUstrNm"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-btn
            v-if="showUstr"
            text
            color="warning"
            :href="urlFileUstr"
            target="_blank"
            >Посмотреть</v-btn
          >
          <v-btn text color="warning" @click="uploadFileUstr()"
            >Загрузить</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="12" sm="6" md="3" align-self="center">
          Причина отказа по акту</v-col
        >
        <v-col cols="12" sm="6" md="4" align-self="center">
          <v-textarea
            clearable
            label="Причина отказа по докладу"
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
            v-model="fileAktM"
            show-size
            :label="aktNm"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6" md="3" align-self="center">
          <v-btn
            v-if="showAkt"
            text
            color="warning"
            :href="urlFileAkt"
            target="_blank"
            >Посмотреть</v-btn
          >
          <v-btn text color="warning" @click="uploadFileAkt()">Загрузить</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "Fail",
  data: () => ({
    fail: {},

    show: false,
    showUstr: false,
    showAkt: false,

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
    urlFIleUstr: "",
    urlFileAkt: "",

    parseDateTimeOtk: null,
    parseDateTimeUstr: null,
    yearRelease: [],
    year: 1901,
    rezultItems: [{ KOD: 1 }, { KOD: 2 }, { KOD: 3 }, { KOD: 4 }],
    vidrabItems: [{ KOD: 1 }, { KOD: 2 }, { KOD: 3 }],
  }),

  async mounted() {
    await this.getFail();
    this.setYearItems();
    this.date = this.parseDate(this.fail.dateotk);
    if (this.fail.dateustr != null) {
      this.dateUstrModel = this.parseDate(this.fail.dateustr);
    }
    this.time = this.fail.timeotk;
    this.timeUstrModel = this.fail.timeustr;
    this.parseDateTime(this.date, this.time);

    this.radioProstanovki = this.fail.prostanovki;
    this.radioPrperevodnarezerv = this.fail.prperevodnarezerv;
    this.aktM = this.fail.akt;
    this.prichaM = this.fail.pricha;
    this.prichdM = this.fail.prichd;
    this.nunameM = this.fail.nuname;
    this.pspnameM = this.fail.pspname;
    this.siknM = this.fail.spr_recid;
    this.fioDetOtkM = this.fail.fio_det_otk;
    this.monitoringPspOtkM = this.fail.monitoring_psp_otkaz;
    this.monitoringPspUstrM = this.fail.monitoring_psp_ustr;
    this.nameOborM = this.fail.name_obor;
    this.tipOborM = this.fail.tip_obor;
    this.yearVipOborM = this.fail.year_vip_obor;
    this.yearVvodOborM = this.fail.year_vvod_obor;
    this.zavodNumM = this.fail.zavod_number;
    this.rezultOtkaz = this.fail.rezult_otkaz;
    this.reestrOvp = this.fail.reestrovp;
    this.vidrab = this.fail.vidrab;

    // проверяем, есть ли в БД ссылка на файл донесения об отказе
    if (this.fail.report_otkaz_lnk != null) {
      this.reportOtkazLnk = this.fail.report_otkaz_lnk;
      this.urlFileOtk = this.url + this.reportOtkazLnk;
      this.show = !this.show;
    }
    if (this.fail.report_otkaz_nm != null) {
      this.reportOtkazNm = this.fail.report_otkaz_nm;
    }
    // проверяем, есть ли в БД ссылка на файл донесения об устранении
    if (this.fail.report_ustr_lnk != null) {
      this.reportUstrLnk = this.fail.report_ustr_lnk;
      this.urlFileUstr = this.url + this.reportUstrLnk;
      this.showUstr = !this.showUstr;
    }
    if (this.fail.report_ustr_nm != null) {
      this.reportUstrNm = this.fail.report_ustr_nm;
    }
    // проверяем, есть ли в БД ссылка на файл акта
    if (this.fail.akt_lnk != null) {
      this.aktLnk = this.fail.akt_lnk;
      this.urlFileAkt = this.url + this.aktLnk;
      this.showAkt = !this.showAkt;
    }
    if (this.fail.akt_nm != null) {
      this.aktNm = this.fail.akt_nm;
    }
  },

  methods: {
    async getFail() {
      try {
        const { data } = await axios.get(
          "/ords/remont/PKG_SIKN_FAILURES.getJsonFailure",
          { params: { pRECID: this.$route.params.id } }
        );
        if (data.status) {
          this.fail = data.result;
          console.log(this.fail);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error);
      }
    },
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
      router.push("/");
    },
    // фцнкция для удаления отказа из таблицы
    async deleteFailFromTable() {
      const fd = new FormData();
      fd.append("pRecid", this.$route.params.id);
      await axios
        .post(`/ords/remont/PKG_SIKN_FAILURES.deleteFail`, fd, {
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
      router.push("/");
    },
    // функция для преобразования даты и времени в одну строку и формат таблицы
    parseDateTime(date, time) {
      const parsedDateTime =
        date.split("-").join("") + time.split(":").join("") + "00";
      return parsedDateTime;
    },
    // функция для создания массива годов выпуска оборудования
    setYearItems() {
      // for(let i = 0; i < 250; i++) {
      //   this.yearRelease[i] = (1901 + i).toString()
      // }
      while (this.year < 2200) {
        this.yearRelease.push(this.year++);
      }
    },
    // функция для добавления файла донесения об отказе в БД
    async uploadFileOtkaz() {
      const fd = new FormData();
      fd.append("pRecid", this.$route.params.id);
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
    // функция для добавления файла донесения об устранении в БД
    async uploadFileUstr() {
      const fd = new FormData();
      fd.append("pRecid", this.$route.params.id);
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
    // функция для добавления файла акта в БД
    async uploadFileAkt() {
      const fd = new FormData();
      fd.append("pRecid", this.$route.params.id);
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
    openDonesenie() {
      window.location.href =
        "http://vus01-piwls--03.ufa.tn.corp:7003/remont-app/Controller?action=remont.makeexternaldocument&procName=donosexcel&potkaz=" +
        this.$route.params.id;
    },
    openDonesenieUstr() {
      window.location.href =
        "http://vus01-piwls--03.ufa.tn.corp:7003/remont-app/Controller?action=remont.makeexternaldocument&procName=ustrexcel&potkaz=" +
        this.$route.params.id;
    },
  },
};
</script>

<style>
</style>