'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Disclaimer() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className='relative w-full h-[200px] bg-cover bg-center'
        style={{
          backgroundImage: `url('/images/disclaimer/image.jpg')`
        }}
      >
        <div className='absolute inset-0 bg-black/50 z-0'></div>
        <div className='relative h-full flex flex-col items-center justify-center text-center text-white z-10'>
          <h1 className='text-3xl md:text-5xl font-semibold mb-4'>
            Disclaimer
          </h1>
          <p className='text-base md:text-lg font-medium'>
            <Link href="/" className="hover:text-[#40433F] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span>Disclaimer</span>
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
                June 05, 2026
              </p>
            </div>
          </section>

          {/* Interpretation and Definitions Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Interpretation and Definitions</h2>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-xl font-bold text-[#40433F] mb-4">Interpretation</h3>
              <p className="text-base text-[#40433F] mb-4">
                The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
              </p>

              <h3 className="text-xl font-bold text-[#40433F] mb-4">Definitions</h3>
              <p className="text-base text-[#40433F]">
                For the purposes of this Disclaimer:<br/><br/>
                • Company (referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to E2 Visa LLC, 9040 Town Center Parkway, Lakewood Ranch, FL 34202.<br/><br/>
                • Service refers to the Website.<br/><br/>
                • You means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.<br/><br/>
                • Website refers to E2 Visa, accessible from <Link href="https://e2visa.com/" className="text-[#40433F] hover:underline" target="_blank">https://e2visa.com/</Link>
              </p>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The information contained on the Service is for general information purposes only.<br/><br/>
                The Company assumes no responsibility for errors or omissions in the contents of the Service.<br/><br/>
                In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.<br/><br/>
                The Company does not warrant that the Service is free of viruses or other harmful components.
              </p>
            </div>
          </section>

          {/* External Links Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">External Links Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company.<br/><br/>
                Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
              </p>
            </div>
          </section>

          {/* Advertising Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Advertising Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                Third-party advertisements and links to third-party websites may also appear while using the Service. The Company does not make any representation as to the accuracy or suitability of any of the information contained in those advertisements or websites and does not accept any responsibility or liability for the conduct or content of those advertisements and websites and the offerings made by the third parties.<br/><br/>
                Third-party advertisements and links to other websites where goods or services are advertised are not endorsements or recommendations by the Company of the third-party sites, goods or services. The Company takes no responsibility for the content of the ads, promises made, or the quality/reliability of the products or services offered in all advertisements.
              </p>
            </div>
          </section>

          {/* Errors and Omissions Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Errors and Omissions Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to ensure that the content of the Service is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained on the Service.<br/><br/>
                The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.
              </p>
            </div>
          </section>

          {/* Fair Use Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Fair Use Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.<br/><br/>
                The Company believes this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright law (or equivalent provisions under applicable law).<br/><br/>
                If You wish to use copyrighted material from the Service for your own purposes that go beyond fair use, You must obtain permission from the copyright owner.
              </p>
            </div>
          </section>

          {/* Views Expressed Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">Views Expressed Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The Service may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer or company, including the Company.<br/><br/>
                If the Service allows users to post content (including comments), such content is the sole responsibility of the user who posted it. The Company is not liable for user-generated content and reserves the right to remove it for any reason.
              </p>
            </div>
          </section>

          {/* No Responsibility Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">No Responsibility Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.<br/><br/>
                In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.
              </p>
            </div>
          </section>

          {/* "Use at Your Own Risk" Disclaimer */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#40433F]">"Use at Your Own Risk" Disclaimer</h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base text-[#40433F]">
                All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.<br/><br/>
                The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.
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
                If you have any questions about this Disclaimer, You can contact Us:<br/><br/>
                By email: info@e2visa.com<br/>
                By visiting this page on our website: <Link href="https://e2visa.com/" className="text-[#40433F] hover:underline" target="_blank">https://e2visa.com/</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 