'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className='relative w-full h-[200px] bg-cover bg-center'
        style={{
          backgroundImage: `url('/images/privacy-policy/img.jpg')`
        }}
      >
        <div className='absolute inset-0 bg-black/50 z-0'></div>
        <div className='relative h-full flex flex-col items-center justify-center text-center text-white z-10'>
          <h1 className='text-3xl md:text-5xl font-semibold mb-4'>
            Privacy Policy
          </h1>
          <p className='text-base md:text-lg font-medium'>
            <Link href="/" className="hover:text-[#40433F] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>

      <div className="">
        <div className="bg-white container rounded-lg p-8 md:p-12">
          {/* Last Updated Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Last Updated</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                April 28, 2022
              </p>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Introduction</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.<br/><br/>
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </div>
          </section>

          {/* Interpretation Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Interpretation</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
              </p>
            </div>
          </section>

          {/* Definitions Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Definitions</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                For the purposes of this Privacy Policy:<br/><br/>
                • Account means a unique account created for You to access our Service or parts of our Service.<br/><br/>
                • Business, for the purpose of the CCPA (California Consumer Privacy Act), refers to the Company as the legal entity that collects Consumers' personal information and determines the purposes and means of the processing of Consumers' personal information, or on behalf of which such information is collected and that alone, or jointly with others, determines the purposes and means of the processing of consumers' personal information, that does business in the State of California.<br/><br/>
                • Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to E2 Visa LLC, 3928 Pin Oaks St, Sarasota, FL 34232.<br/><br/>
                • For the purpose of the GDPR, the Company is the Data Controller.<br/><br/>
                • Consumer, for the purpose of the CCPA (California Consumer Privacy Act), means a natural person who is a California resident. A resident, as defined in the law, includes (1) every individual who is in the USA for other than a temporary or transitory purpose, and (2) every individual who is domiciled in the USA who is outside the USA for a temporary or transitory purpose.<br/><br/>
                • Cookies are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.<br/><br/>
                • Country refers to: Florida, United States<br/><br/>
                • Data Controller, for the purposes of the GDPR (General Data Protection Regulation), refers to the Company as the legal person which alone or jointly with others determines the purposes and means of the processing of Personal Data.<br/><br/>
                • Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.<br/><br/>
                • Do Not Track (DNT) is a concept that has been promoted by US regulatory authorities, in particular the U.S. Federal Trade Commission (FTC), for the Internet industry to develop and implement a mechanism for allowing internet users to control the tracking of their online activities across websites.<br/><br/>
                • Personal Data is any information that relates to an identified or identifiable individual.<br/><br/>
                • For the purposes of GDPR, Personal Data means any information relating to You such as a name, an identification number, location data, online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity.<br/><br/>
                • For the purposes of the CCPA, Personal Data means any information that identifies, relates to, describes or is capable of being associated with, or could reasonably be linked, directly or indirectly, with You.<br/><br/>
                • Sale, for the purpose of the CCPA (California Consumer Privacy Act), means selling, renting, releasing, disclosing, disseminating, making available, transferring, or otherwise communicating orally, in writing, or by electronic or other means, a Consumer's personal information to another business or a third party for monetary or other valuable consideration.<br/><br/>
                • Service refers to the Website.<br/><br/>
                • Service Provider means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used. For the purpose of the GDPR, Service Providers are considered Data Processors.<br/><br/>
                • Third-party Social Media Service refers to any website or any social network website through which a User can log in or create an account to use the Service.<br/><br/>
                • Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).<br/><br/>
                • Website refers to E2 Visa, accessible from https://e2visa.com/<br/><br/>
                • You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.<br/><br/>
                • Under GDPR (General Data Protection Regulation), You can be referred to as the Data Subject or as the User as you are the individual using the Service.
              </p>
            </div>
          </section>

          {/* Collecting and Using Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Collecting and Using Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-xl font-bold text-[#40433F] mb-4">Types of Data Collected</h3>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Personal Data</h4>
              <p className="text-base text-[#40433F] mb-4">
                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:<br/><br/>
                • Email address<br/>
                • First name and last name<br/>
                • Phone number<br/>
                • Address, State, Province, ZIP/Postal code, City<br/>
                • Usage Data
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Usage Data</h4>
              <p className="text-base text-[#40433F] mb-4">
                Usage Data is collected automatically when using the Service.<br/><br/>
                Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.<br/><br/>
                When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.<br/><br/>
                We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Information from Third-Party Social Media Services</h4>
              <p className="text-base text-[#40433F] mb-4">
                The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:<br/><br/>
                • Google<br/>
                • Facebook<br/>
                • Twitter<br/>
                • LinkedIn<br/><br/>
                If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account.<br/><br/>
                You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Tracking Technologies and Cookies</h4>
              <p className="text-base text-[#40433F] mb-4">
                We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:<br/><br/>
                • Cookies or Browser Cookies. A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.<br/><br/>
                • Flash Cookies. Certain features of our Service may use local stored objects (or Flash Cookies) to collect and store information about Your preferences or Your activity on our Service. Flash Cookies are not managed by the same browser settings as those used for Browser Cookies. For more information on how You can delete Flash Cookies, please read "Where can I change the settings for disabling, or deleting local shared objects?" available at <Link href="https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_" className="text-[#40433F] hover:underline" target="_blank">https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html</Link><br/><br/>
                • Web Beacons. Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).<br/><br/>
                Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.<br/><br/>
                We use both Session and Persistent Cookies for the purposes set out below:
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Necessary / Essential Cookies</h4>
              <p className="text-base text-[#40433F] mb-4">
                Type: Session Cookies<br/>
                Administered by: Us<br/>
                Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Cookies Policy / Notice Acceptance Cookies</h4>
              <p className="text-base text-[#40433F] mb-4">
                Type: Persistent Cookies<br/>
                Administered by: Us<br/>
                Purpose: These Cookies identify if users have accepted the use of cookies on the Website.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Functionality Cookies</h4>
              <p className="text-base text-[#40433F] mb-4">
                Type: Persistent Cookies<br/>
                Administered by: Us<br/>
                Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Tracking and Performance Cookies</h4>
              <p className="text-base text-[#40433F] mb-4">
                Type: Persistent Cookies<br/>
                Administered by: Third-Parties<br/>
                Purpose: These Cookies are used to track information about traffic to the Website and how users use the Website. The information gathered via these Cookies may directly or indirectly identify you as an individual visitor. This is because the information collected is typically linked to a pseudonymous identifier associated with the device you use to access the Website. We may also use these Cookies to test new pages, features or new functionality of the Website to see how our users react to them.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Targeting and Advertising Cookies</h4>
              <p className="text-base text-[#40433F]">
                Type: Persistent Cookies<br/>
                Administered by: Third-Parties<br/>
                Purpose: These Cookies track your browsing habits to enable Us to show advertising which is more likely to be of interest to You. These Cookies use information about your browsing history to group You with other users who have similar interests. Based on that information, and with Our permission, third party advertisers can place Cookies to enable them to show adverts which We think will be relevant to your interests while You are on third party websites.<br/><br/>
                For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Use of Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Use of Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F] mb-4">
                The Company may use Personal Data for the following purposes:<br/><br/>
                • To provide and maintain our Service, including to monitor the usage of our Service.<br/><br/>
                • To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.<br/><br/>
                • For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.<br/><br/>
                • To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.<br/><br/>
                • To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.<br/><br/>
                • To manage Your requests: To attend and manage Your requests to Us.<br/><br/>
                • To deliver targeted advertising to You: We may use Your information to develop and display content and advertising (and work with third-party vendors who do so) tailored to Your interests and/or location and to measure its effectiveness.<br/><br/>
                • For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.<br/><br/>
                • For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.
              </p>

              <p className="text-base text-[#40433F]">
                We may share Your personal information in the following situations:<br/><br/>
                • With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to show advertisements to You to help support and maintain Our Service, to advertise on third party websites to You after You visited our Service, for payment processing, to contact You.<br/><br/>
                • For business transfers: We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.<br/><br/>
                • With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.<br/><br/>
                • With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.<br/><br/>
                • With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If You interact with other users or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your activity, communicate with You and view Your profile.<br/><br/>
                • With Your consent: We may disclose Your personal information for any other purpose with Your consent.
              </p>
            </div>
          </section>

          {/* Retention of Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Retention of Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.<br/><br/>
                The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
              </p>
            </div>
          </section>

          {/* Transfer of Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Transfer of Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.<br/><br/>
                Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.<br/><br/>
                The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.
              </p>
            </div>
          </section>

          {/* Disclosure of Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Disclosure of Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Business Transactions</h4>
              <p className="text-base text-[#40433F] mb-4">
                If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Law enforcement</h4>
              <p className="text-base text-[#40433F] mb-4">
                Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
              </p>

              <h4 className="text-lg font-bold text-[#40433F] mb-2">Other legal requirements</h4>
              <p className="text-base text-[#40433F]">
                The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:<br/><br/>
                • Comply with a legal obligation<br/>
                • Protect and defend the rights or property of the Company<br/>
                • Prevent or investigate possible wrongdoing in connection with the Service<br/>
                • Protect the personal safety of Users of the Service or the public<br/>
                • Protect against legal liability
              </p>
            </div>
          </section>

          {/* Security of Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Security of Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Detailed Information on the Processing of Your Personal Data */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Detailed Information on the Processing of Your Personal Data</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F] mb-4">
                The Service Providers We use may have access to Your Personal Data. These third-party vendors collect, store, use, process and transfer information about Your activity on Our Service in accordance with their Privacy Policies.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Analytics</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may use third-party Service providers to monitor and analyze the use of our Service.
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Google Analytics</h4>
              <p className="text-base text-[#40433F] mb-4">
                Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.<br/><br/>
                You can opt-out of having made your activity on the Service available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js and dc.js) from sharing information with Google Analytics about visits activity.<br/><br/>
                For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: <Link href="https://policies.google.com/privacy" className="text-[#40433F] hover:underline" target="_blank">https://policies.google.com/privacy</Link>
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Advertising</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may use Service Providers to show advertisements to You to help support and maintain Our Service.
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Google AdSense & DoubleClick Cookie</h4>
              <p className="text-base text-[#40433F] mb-4">
                Google, as a third party vendor, uses cookies to serve ads on our Service. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our Service or other websites on the Internet.<br/><br/>
                You may opt out of the use of the DoubleClick Cookie for interest-based advertising by visiting the Google Ads Settings web page: <Link href="http://www.google.com/ads/preferences/" className="text-[#40433F] hover:underline" target="_blank">http://www.google.com/ads/preferences/</Link>
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Email Marketing</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may use Your Personal Data to contact You with newsletters, marketing or promotional materials and other information that may be of interest to You. You may opt-out of receiving any, or all, of these communications from Us by following the unsubscribe link or instructions provided in any email We send or by contacting Us.<br/><br/>
                We may use Email Marketing Service Providers to manage and send emails to You.
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Sendinblue</h4>
              <p className="text-base text-[#40433F] mb-4">
                Their Privacy Policy can be viewed at <Link href="https://www.sendinblue.com/legal/privacypolicy/" className="text-[#40433F] hover:underline" target="_blank">https://www.sendinblue.com/legal/privacypolicy/</Link>
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Payments</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may provide paid products and/or services within the Service. In that case, we may use third-party services for payment processing (e.g. payment processors).<br/><br/>
                We will not store or collect Your payment card details. That information is provided directly to Our third-party payment processors whose use of Your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">PayPal</h4>
              <p className="text-base text-[#40433F] mb-4">
                Their Privacy Policy can be viewed at <Link href="https://www.paypal.com/webapps/mpp/ua/privacy-full" className="text-[#40433F] hover:underline" target="_blank">https://www.paypal.com/webapps/mpp/ua/privacy-full</Link>
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Priority Business Solutions</h4>
              <p className="text-base text-[#40433F] mb-4">
                Their Privacy Policy can be viewed at <Link href="https://policies.hibuwebsites.com/privacy-policy" className="text-[#40433F] hover:underline" target="_blank">https://policies.hibuwebsites.com/privacy-policy</Link>
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Behavioral Remarketing</h3>
              <p className="text-base text-[#40433F] mb-4">
                The Company uses remarketing services to advertise to You after You accessed or visited our Service. We and Our third-party vendors use cookies and non-cookie technologies to help Us recognize Your Device and understand how You use our Service so that We can improve our Service to reflect Your interests and serve You advertisements that are likely to be of more interest to You.<br/><br/>
                These third-party vendors collect, store, use, process and transfer information about Your activity on Our Service in accordance with their Privacy Policies and to enable Us to:<br/><br/>
                • Measure and analyze traffic and browsing activity on Our Service<br/>
                • Show advertisements for our products and/or services to You on third-party websites or apps<br/>
                • Measure and analyze the performance of Our advertising campaigns<br/><br/>
                Some of these third-party vendors may use non-cookie technologies that may not be impacted by browser settings that block cookies. Your browser may not permit You to block such technologies. You can use the following third-party tools to decline the collection and use of information for the purpose of serving You interest-based advertising:<br/><br/>
                • The NAI's opt-out platform: <Link href="http://www.networkadvertising.org/choices/" className="text-[#40433F] hover:underline" target="_blank">http://www.networkadvertising.org/choices/</Link><br/>
                • The EDAA's opt-out platform: <Link href="http://www.youronlinechoices.com/" className="text-[#40433F] hover:underline" target="_blank">http://www.youronlinechoices.com/</Link><br/>
                • The DAA's opt-out platform: <Link href="http://optout.aboutads.info/?c=2&lang=EN" className="text-[#40433F] hover:underline" target="_blank">http://optout.aboutads.info/?c=2&lang=EN</Link><br/><br/>
                You may opt-out of all personalized advertising by enabling privacy features on Your mobile device such as Limit Ad Tracking (iOS) and Opt Out of Ads Personalization (Android). See Your mobile device Help system for more information.<br/><br/>
                We may share information, such as hashed email addresses (if available) or other online identifiers collected on Our Service with these third-party vendors. This allows Our third-party vendors to recognize and deliver You ads across devices and browsers. To read more about the technologies used by these third-party vendors and their cross-device capabilities please refer to the Privacy Policy of each vendor listed below.<br/><br/>
                The third-party vendors We use are:
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Facebook</h4>
              <p className="text-base text-[#40433F] mb-4">
                Facebook remarketing service is provided by Facebook Inc.<br/><br/>
                You can learn more about interest-based advertising from Facebook by visiting this page: <Link href="https://www.facebook.com/help/516147308587266" className="text-[#40433F] hover:underline" target="_blank">https://www.facebook.com/help/516147308587266</Link><br/><br/>
                To opt-out from Facebook's interest-based ads, follow these instructions from Facebook: <Link href="https://www.facebook.com/help/568137493302217" className="text-[#40433F] hover:underline" target="_blank">https://www.facebook.com/help/568137493302217</Link><br/><br/>
                Facebook adheres to the Self-Regulatory Principles for Online Behavioural Advertising established by the Digital Advertising Alliance. You can also opt-out from Facebook and other participating companies through the Digital Advertising Alliance in the USA <Link href="http://www.aboutads.info/choices/" className="text-[#40433F] hover:underline" target="_blank">http://www.aboutads.info/choices/</Link>, the Digital Advertising Alliance of Canada in Canada <Link href="http://youradchoices.ca/" className="text-[#40433F] hover:underline" target="_blank">http://youradchoices.ca/</Link> or the European Interactive Digital Advertising Alliance in Europe <Link href="http://www.youronlinechoices.eu/" className="text-[#40433F] hover:underline" target="_blank">http://www.youronlinechoices.eu/</Link>, or opt-out using your mobile device settings.<br/><br/>
                For more information on the privacy practices of Facebook, please visit Facebook's Data Policy: <Link href="https://www.facebook.com/privacy/explanation" className="text-[#40433F] hover:underline" target="_blank">https://www.facebook.com/privacy/explanation</Link>
              </p>
              <h4 className="text-lg font-bold text-[#40433F] mb-2">Sendinblue</h4>
              <p className="text-base text-[#40433F]">
                Their Privacy Policy can be viewed at <Link href="https://www.sendinblue.com/legal/privacypolicy/" className="text-[#40433F] hover:underline" target="_blank">https://www.sendinblue.com/legal/privacypolicy/</Link>
              </p>
            </div>
          </section>

          {/* GDPR Privacy */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">GDPR Privacy</h2>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-xl font-bold text-[#40433F] mb-4">Legal Basis for Processing Personal Data under GDPR</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may process Personal Data under the following conditions:<br/><br/>
                • Consent: You have given Your consent for processing Personal Data for one or more specific purposes.<br/><br/>
                • Performance of a contract: Provision of Personal Data is necessary for the performance of an agreement with You and/or for any pre-contractual obligations thereof.<br/><br/>
                • Legal obligations: Processing Personal Data is necessary for compliance with a legal obligation to which the Company is subject.<br/><br/>
                • Vital interests: Processing Personal Data is necessary in order to protect Your vital interests or of another natural person.<br/><br/>
                • Public interests: Processing Personal Data is related to a task that is carried out in the public interest or in the exercise of official authority vested in the Company.<br/><br/>
                • Legitimate interests: Processing Personal Data is necessary for the purposes of the legitimate interests pursued by the Company.<br/><br/>
                In any case, the Company will gladly help to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Your Rights under the GDPR</h3>
              <p className="text-base text-[#40433F] mb-4">
                The Company undertakes to respect the confidentiality of Your Personal Data and to guarantee You can exercise Your rights.<br/><br/>
                You have the right under this Privacy Policy, and by law if You are within the EU, to:<br/><br/>
                • Request access to Your Personal Data. The right to access, update or delete the information We have on You. Whenever made possible, you can access, update or request deletion of Your Personal Data directly within Your account settings section. If you are unable to perform these actions yourself, please contact Us to assist You. This also enables You to receive a copy of the Personal Data We hold about You.<br/><br/>
                • Request correction of the Personal Data that We hold about You. You have the right to have any incomplete or inaccurate information We hold about You corrected.<br/><br/>
                • Object to processing of Your Personal Data. This right exists where We are relying on a legitimate interest as the legal basis for Our processing and there is something about Your particular situation, which makes You want to object to our processing of Your Personal Data on this ground. You also have the right to object where We are processing Your Personal Data for direct marketing purposes.<br/><br/>
                • Request erasure of Your Personal Data. You have the right to ask Us to delete or remove Personal Data when there is no good reason for Us to continue processing it.<br/><br/>
                • Request the transfer of Your Personal Data. We will provide to You, or to a third-party You have chosen, Your Personal Data in a structured, commonly used, machine-readable format. Please note that this right only applies to automated information which You initially provided consent for Us to use or where We used the information to perform a contract with You.<br/><br/>
                • Withdraw Your consent. You have the right to withdraw Your consent on using your Personal Data. If You withdraw Your consent, We may not be able to provide You with access to certain specific functionalities of the Service.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Exercising of Your GDPR Data Protection Rights</h3>
              <p className="text-base text-[#40433F]">
                You may exercise Your rights of access, rectification, cancellation and opposition by contacting Us. Please note that we may ask You to verify Your identity before responding to such requests. If You make a request, We will try our best to respond to You as soon as possible.<br/><br/>
                You have the right to complain to a Data Protection Authority about Our collection and use of Your Personal Data. For more information, if You are in the European Economic Area (EEA), please contact Your local data protection authority in the EEA.
              </p>
            </div>
          </section>

          {/* CCPA Privacy */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">CCPA Privacy</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F] mb-4">
                This privacy notice section for California residents supplements the information contained in Our Privacy Policy and it applies solely to all visitors, users, and others who reside in the State of California.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Categories of Personal Information Collected</h3>
              <p className="text-base text-[#40433F] mb-4">
                We collect information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular Consumer or Device. The following is a list of categories of personal information which we may collect or may have been collected from California residents within the last twelve (12) months.<br/><br/>
                Please note that the categories and examples provided in the list below are those defined in the CCPA. This does not mean that all examples of that category of personal information were in fact collected by Us, but reflects our good faith belief to the best of our knowledge that some of that information from the applicable category may be and may have been collected. For example, certain categories of personal information would only be collected if You provided such personal information directly to Us.<br/><br/>
                • Category A: Identifiers. Examples: A real name, alias, postal address, unique personal identifier, online identifier, Internet Protocol address, email address, account name, driver's license number, passport number, or other similar identifiers. Collected: Yes.<br/><br/>
                • Category B: Personal information categories listed in the California Customer Records statute (Cal. Civ. Code § 1798.80(e)). Examples: A name, signature, Social Security number, physical characteristics or description, address, telephone number, passport number, driver's license or state identification card number, insurance policy number, education, employment, employment history, bank account number, credit card number, debit card number, or any other financial information, medical information, or health insurance information. Some personal information included in this category may overlap with other categories. Collected: Yes.<br/><br/>
                • Category C: Protected classification characteristics under California or federal law. Examples: Age (40 years or older), race, color, ancestry, national origin, citizenship, religion or creed, marital status, medical condition, physical or mental disability, sex (including gender, gender identity, gender expression, pregnancy or childbirth and related medical conditions), sexual orientation, veteran or military status, genetic information (including familial genetic information). Collected: No.<br/><br/>
                • Category D: Commercial information. Examples: Records and history of products or services purchased or considered. Collected: Yes.<br/><br/>
                • Category E: Biometric information. Examples: Genetic, physiological, behavioral, and biological characteristics, or activity patterns used to extract a template or other identifier or identifying information, such as, fingerprints, faceprints, and voiceprints, iris or retina scans, keystroke, gait, or other physical patterns, and sleep, health, or exercise data. Collected: No.<br/><br/>
                • Category F: Internet or other similar network activity. Examples: Interaction with our Service or advertisement. Collected: Yes.<br/><br/>
                • Category G: Geolocation data. Examples: Approximate physical location. Collected: No.<br/><br/>
                • Category H: Sensory data. Examples: Audio, electronic, visual, thermal, olfactory, or similar information. Collected: No.<br/><br/>
                • Category I: Professional or employment-related information. Examples: Current or past job history or performance evaluations. Collected: No.<br/><br/>
                • Category J: Non-public education information (per the Family Educational Rights and Privacy Act (20 U.S.C. Section 1232g, 34 C.F.R. Part 99)). Examples: Education records directly related to a student maintained by an educational institution or party acting on its behalf, such as grades, transcripts, class lists, student schedules, student identification codes, student financial information, or student disciplinary records. Collected: No.<br/><br/>
                • Category K: Inferences drawn from other personal information. Examples: Profile reflecting a person's preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, and aptitudes. Collected: No.<br/><br/>
                Under CCPA, personal information does not include:<br/><br/>
                • Publicly available information from government records<br/>
                • Deidentified or aggregated consumer information<br/>
                • Information excluded from the CCPA's scope, such as: health or medical information covered by the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the California Confidentiality of Medical Information Act (CMIA) or clinical trial data; Personal Information covered by certain sector-specific privacy laws, including the Fair Credit Reporting Act (FRCA), the Gramm-Leach-Bliley Act (GLBA) or California Financial Information Privacy Act (FIPA), and the Driver's Privacy Protection Act of 1994
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Sources of Personal Information</h3>
              <p className="text-base text-[#40433F] mb-4">
                We obtain the categories of personal information listed above from the following categories of sources:<br/><br/>
                • Directly from You. For example, from the forms You complete on our Service, preferences You express or provide through our Service, or from Your purchases on our Service.<br/><br/>
                • Indirectly from You. For example, from observing Your activity on our Service.<br/><br/>
                • Automatically from You. For example, through cookies We or our Service Providers set on Your Device as You navigate through our Service.<br/><br/>
                • From Service Providers. For example, third-party vendors to monitor and analyze the use of our Service, third-party vendors to provide advertising on our Service, third-party vendors to deliver targeted advertising to You, third-party vendors for payment processing, or other third-party vendors that We use to provide the Service to You.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Use of Personal Information for Business Purposes or Commercial Purposes</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may use or disclose personal information We collect for "business purposes" or "commercial purposes" (as defined under the CCPA), which may include the following examples:<br/><br/>
                • To operate our Service and provide You with our Service.<br/>
                • To provide You with support and to respond to Your inquiries, including to investigate and address Your concerns and monitor and improve our Service.<br/>
                • To fulfill or meet the reason You provided the information. For example, if You share Your contact information to ask a question about our Service, We will use that personal information to respond to Your inquiry. If You provide Your personal information to purchase a product or service, We will use that information to process Your payment and facilitate delivery.<br/>
                • To respond to law enforcement requests and as required by applicable law, court order, or governmental regulations.<br/>
                • As described to You when collecting Your personal information or as otherwise set forth in the CCPA.<br/>
                • For internal administrative and auditing purposes.<br/>
                • To detect security incidents and protect against malicious, deceptive, fraudulent or illegal activity, including, when necessary, to prosecute those responsible for such activities.<br/><br/>
                Please note that the examples provided above are illustrative and not intended to be exhaustive. For more details on how we use this information, please refer to the "Use of Your Personal Data" section.<br/><br/>
                If We decide to collect additional categories of personal information or use the personal information We collected for materially different, unrelated, or incompatible purposes We will update this Privacy Policy.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Disclosure of Personal Information for Business Purposes or Commercial Purposes</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may use or disclose and may have used or disclosed in the last twelve (12) months the following categories of personal information for business or commercial purposes:<br/><br/>
                • Category A: Identifiers<br/>
                • Category B: Personal information categories listed in the California Customer Records statute (Cal. Civ. Code § 1798.80(e))<br/>
                • Category D: Commercial information<br/>
                • Category F: Internet or other similar network activity<br/><br/>
                Please note that the categories listed above are those defined in the CCPA. This does not mean that all examples of that category of personal information were in fact disclosed, but reflects our good faith belief to the best of our knowledge that some of that information from the applicable category may be and may have been disclosed.<br/><br/>
                When We disclose personal information for a business purpose or a commercial purpose, We enter a contract that describes the purpose and requires the recipient to both keep that personal information confidential and not use it for any purpose except performing the contract.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Sale of Personal Information</h3>
              <p className="text-base text-[#40433F] mb-4">
                As defined in the CCPA, "sell" and "sale" mean selling, renting, releasing, disclosing, disseminating, making available, transferring, or otherwise communicating orally, in writing, or by electronic or other means, a consumer's personal information by the business to a third party for valuable consideration. This means that We may have received some kind of benefit in return for sharing personal information, but not necessarily a monetary benefit.<br/><br/>
                Please note that the categories listed below are those defined in the CCPA. This does not mean that all examples of that category of personal information were in fact sold, but reflects our good faith belief to the best of our knowledge that some of that information from the applicable category may be and may have been shared for value in return.<br/><br/>
                We may sell and may have sold in the last twelve (12) months the following categories of personal information:<br/><br/>
                • Category A: Identifiers<br/>
                • Category B: Personal information categories listed in the California Customer Records statute (Cal. Civ. Code § 1798.80(e))<br/>
                • Category D: Commercial information<br/>
                • Category F: Internet or other similar network activity
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Share of Personal Information</h3>
              <p className="text-base text-[#40433F] mb-4">
                We may share Your personal information identified in the above categories with the following categories of third parties:<br/><br/>
                • Service Providers<br/>
                • Payment processors<br/>
                • Our affiliates<br/>
                • Our business partners<br/>
                • Third party vendors to whom You or Your agents authorize Us to disclose Your personal information in connection with products or services We provide to You
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Sale of Personal Information of Minors Under 16 Years of Age</h3>
              <p className="text-base text-[#40433F] mb-4">
                We do not knowingly collect personal information from minors under the age of 16 through our Service, although certain third party websites that we link to may do so. These third-party websites have their own terms of use and privacy policies and we encourage parents and legal guardians to monitor their children's Internet usage and instruct their children to never provide information on other websites without their permission.<br/><br/>
                We do not sell the personal information of Consumers We actually know are less than 16 years of age, unless We receive affirmative authorization (the "right to opt-in") from either the Consumer who is between 13 and 16 years of age, or the parent or guardian of a Consumer less than 13 years of age. Consumers who opt-in to the sale of personal information may opt-out of future sales at any time. To exercise the right to opt-out, You (or Your authorized representative) may submit a request to Us by contacting Us.<br/><br/>
                If You have reason to believe that a child under the age of 13 (or 16) has provided Us with personal information, please contact Us with sufficient detail to enable Us to delete that information.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Your Rights under the CCPA</h3>
              <p className="text-base text-[#40433F] mb-4">
                The CCPA provides California residents with specific rights regarding their personal information. If You are a resident of California, You have the following rights:<br/><br/>
                • The right to notice. You have the right to be notified which categories of Personal Data are being collected and the purposes for which the Personal Data is being used.<br/><br/>
                • The right to request. Under CCPA, You have the right to request that We disclose information to You about Our collection, use, sale, disclosure for business purposes and share of personal information. Once We receive and confirm Your request, We will disclose to You: the categories of personal information We collected about You; the categories of sources for the personal information We collected about You; Our business or commercial purpose for collecting or selling that personal information; the categories of third parties with whom We share that personal information; and the specific pieces of personal information We collected about You. If we sold Your personal information or disclosed Your personal information for a business purpose, We will disclose to You the categories of personal information categories sold and the categories of personal information categories disclosed.<br/><br/>
                • The right to say no to the sale of Personal Data (opt-out). You have the right to direct Us to not sell Your personal information. To submit an opt-out request please contact Us.<br/><br/>
                • The right to delete Personal Data. You have the right to request the deletion of Your Personal Data, subject to certain exceptions. Once We receive and confirm Your request, We will delete (and direct Our Service Providers to delete) Your personal information from our records, unless an exception applies. We may deny Your deletion request if retaining the information is necessary for Us or Our Service Providers to: complete the transaction for which We collected the personal information, provide a good or service that You requested, take actions reasonably anticipated within the context of our ongoing business relationship with You, or otherwise perform our contract with You; detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity, or prosecute those responsible for such activities; debug products to identify and repair errors that impair existing intended functionality; exercise free speech, ensure the right of another consumer to exercise their free speech rights, or exercise another right provided for by law; comply with the California Electronic Communications Privacy Act (Cal. Penal Code § 1546 et. seq.); engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when the information's deletion may likely render impossible or seriously impair the research's achievement, if You previously provided informed consent; enable solely internal uses that are reasonably aligned with consumer expectations based on Your relationship with Us; comply with a legal obligation; or make other internal and lawful uses of that information that are compatible with the context in which You provided it.<br/><br/>
                • The right not to be discriminated against. You have the right not to be discriminated against for exercising any of Your consumer's rights, including by: denying goods or services to You; charging different prices or rates for goods or services, including the use of discounts or other benefits or imposing penalties; providing a different level or quality of goods or services to You; or suggesting that You will receive a different price or rate for goods or services or a different level or quality of goods or services.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Exercising Your CCPA Data Protection Rights</h3>
              <p className="text-base text-[#40433F] mb-4">
                In order to exercise any of Your rights under the CCPA, and if You are a California resident, You can contact Us:<br/><br/>
                • By email: info@e2visa.com<br/>
                • By visiting this page on our website: <Link href="https://e2visa.com/" className="text-[#40433F] hover:underline">https://e2visa.com/</Link><br/><br/>
                Only You, or a person registered with the California Secretary of State that You authorize to act on Your behalf, may make a verifiable request related to Your personal information.<br/><br/>
                Your request to Us must:<br/><br/>
                • Provide sufficient information that allows Us to reasonably verify You are the person about whom We collected personal information or an authorized representative<br/>
                • Describe Your request with sufficient detail that allows Us to properly understand, evaluate, and respond to it<br/><br/>
                We cannot respond to Your request or provide You with the required information if We cannot:<br/><br/>
                • Verify Your identity or authority to make the request<br/>
                • And confirm that the personal information relates to You<br/><br/>
                We will disclose and deliver the required information free of charge within 45 days of receiving Your verifiable request. The time period to provide the required information may be extended once by an additional 45 days when reasonably necessary and with prior notice.<br/><br/>
                Any disclosures We provide will only cover the 12-month period preceding the verifiable request's receipt.<br/><br/>
                For data portability requests, We will select a format to provide Your personal information that is readily usable and should allow You to transmit the information from one entity to another entity without hindrance.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Do Not Sell My Personal Information</h3>
              <p className="text-base text-[#40433F]">
                You have the right to opt-out of the sale of Your personal information. Once We receive and confirm a verifiable consumer request from You, we will stop selling Your personal information. To exercise Your right to opt-out, please contact Us.<br/><br/>
                The Service Providers we partner with (for example, our analytics or advertising partners) may use technology on the Service that sells personal information as defined by the CCPA law. If you wish to opt out of the use of Your personal information for interest-based advertising purposes and these potential sales as defined under CCPA law, you may do so by following the instructions below.<br/><br/>
                Please note that any opt out is specific to the browser You use. You may need to opt out on every browser that You use.<br/><br/>
                Website: You can opt out of receiving ads that are personalized as served by our Service Providers by following our instructions presented on the Service:<br/><br/>
                • The NAI's opt-out platform: <Link href="http://www.networkadvertising.org/choices/" className="text-[#40433F] hover:underline" target="_blank">http://www.networkadvertising.org/choices/</Link><br/>
                • The EDAA's opt-out platform: <Link href="http://www.youronlinechoices.com/" className="text-[#40433F] hover:underline" target="_blank">http://www.youronlinechoices.com/</Link><br/>
                • The DAA's opt-out platform: <Link href="http://optout.aboutads.info/?c=2&lang=EN" className="text-[#40433F] hover:underline" target="_blank">http://optout.aboutads.info/?c=2&lang=EN</Link><br/><br/>
                The opt out will place a cookie on Your computer that is unique to the browser You use to opt out. If you change browsers or delete the cookies saved by your browser, You will need to opt out again.<br/><br/>
                Mobile Devices: Your mobile device may give You the ability to opt out of the use of information about the apps You use in order to serve You ads that are targeted to Your interests:<br/><br/>
                • "Opt out of Interest-Based Ads" or "Opt out of Ads Personalization" on Android devices<br/>
                • "Limit Ad Tracking" on iOS devices<br/><br/>
                You can also stop the collection of location information from Your mobile device by changing the preferences on Your mobile device.
              </p>
            </div>
          </section>

          {/* Do Not Track Policy */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">"Do Not Track" Policy as Required by California Online Privacy Protection Act (CalOPPA)</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                Our Service does not respond to Do Not Track signals.<br/><br/>
                However, some third party websites do keep track of Your browsing activities. If You are visiting such websites, You can set Your preferences in Your web browser to inform websites that You do not want to be tracked. You can enable or disable DNT by visiting the preferences or settings page of Your web browser.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Children's Privacy</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.<br/><br/>
                If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.
              </p>
            </div>
          </section>

          {/* Your California Privacy Rights (Shine the Light law) */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Your California Privacy Rights (California's Shine the Light law)</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                Under California Civil Code Section 1798 (California's Shine the Light law), California residents with an established business relationship with us can request information once a year about sharing their Personal Data with third parties for the third parties' direct marketing purposes.<br/><br/>
                If you'd like to request more information under the California Shine the Light law, and if You are a California resident, You can contact Us using the contact information provided below.
              </p>
            </div>
          </section>

          {/* California Privacy Rights for Minor Users */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">California Privacy Rights for Minor Users (California Business and Professions Code Section 22581)</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                California Business and Professions Code Section 22581 allows California residents under the age of 18 who are registered users of online sites, services or applications to request and obtain removal of content or information they have publicly posted.<br/><br/>
                To request removal of such data, and if You are a California resident, You can contact Us using the contact information provided below, and include the email address associated with Your account.<br/><br/>
                Be aware that Your request does not guarantee complete or comprehensive removal of content or information posted online and that the law may not permit or require removal in certain circumstances.
              </p>
            </div>
          </section>

          {/* Links to Other Websites */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Links to Other Websites</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.<br/><br/>
                We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
              </p>
            </div>
          </section>

          {/* Changes to this Privacy Policy */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Changes to this Privacy Policy</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.<br/><br/>
                We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.<br/><br/>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Us Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Contact Us</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                If you have any questions about this Privacy Policy, You can contact us:<br/><br/>
                By email: info@e2visa.com<br/>
                By visiting this page on our website: <Link href="https://e2visa.com/" className="text-[#40433F] hover:underline">https://e2visa.com/</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
