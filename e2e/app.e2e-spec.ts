import { AngularMaterialTimepickerPage } from './app.po';

describe('angular-material-timepicker App', function() {
  let page: AngularMaterialTimepickerPage;

  beforeEach(() => {
    page = new AngularMaterialTimepickerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
